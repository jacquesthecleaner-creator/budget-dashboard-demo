import TelegramBot, { Message } from 'node-telegram-bot-api';
import axios from 'axios';
import { Buffer } from 'buffer';
import { processReceiptImage } from '@/lib/ocr/receipt-processor';
import { appendTransaction } from '@/lib/google/sheets';

interface UserSession {
  userId: number;
  waitingForConfirmation: boolean;
  lastReceipt?: {
    date: string;
    amount: number;
    merchant: string;
    category: string;
    subcategory: string;
  };
}

const sessions = new Map<number, UserSession>();

export class BudgetBot {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg);
    });

    // Help command
    this.bot.onText(/\/help/, (msg) => {
      this.handleHelp(msg);
    });

    // Handle photo uploads
    this.bot.on('photo', (msg) => {
      this.handlePhotoUpload(msg);
    });

    // Handle text callbacks
    this.bot.onText(/\/confirm/, (msg) => {
      this.handleConfirmation(msg);
    });

    this.bot.onText(/\/cancel/, (msg) => {
      this.handleCancel(msg);
    });
  }

  private async handleStart(msg: Message) {
    const chatId = msg.chat.id;
    const session: UserSession = {
      userId: msg.from?.id || 0,
      waitingForConfirmation: false,
    };
    sessions.set(chatId, session);

    await this.bot.sendMessage(
      chatId,
      'Welcome to Budget Assistant! 📋\n\n' +
        'Send me a receipt photo and I\'ll extract the transaction details and add it to your budget.\n\n' +
        'Commands:\n' +
        '/help - Show this message\n' +
        '/cancel - Cancel current operation'
    );
  }

  private async handleHelp(msg: Message) {
    const chatId = msg.chat.id;
    await this.bot.sendMessage(
      chatId,
      '📸 *How to use:*\n' +
        '1. Send a receipt photo\n' +
        '2. I\'ll extract the date, amount, and merchant\n' +
        '3. Confirm the details or edit them\n' +
        '4. Transaction is saved to Google Sheets\n\n' +
        '💡 *Supported categories:*\n' +
        '• Variable Expenses (Groceries, Fuel, etc.)\n' +
        '• Monthly Bills\n' +
        '• Income\n' +
        '• Savings\n' +
        '• Debt',
      { parse_mode: 'Markdown' }
    );
  }

  private async handlePhotoUpload(msg: Message) {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId) || { userId: msg.from?.id || 0, waitingForConfirmation: false };

    try {
      // Get the photo file
      const photoId = msg.photo?.[msg.photo.length - 1].file_id;
      if (!photoId) {
        await this.bot.sendMessage(chatId, '❌ Failed to get photo. Please try again.');
        return;
      }

      await this.bot.sendMessage(chatId, '⏳ Processing receipt...');

      // Download photo
      const file = await this.bot.getFile(photoId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Process with OCR
      const extracted = await processReceiptImage(buffer, 'image/jpeg');

      session.lastReceipt = {
        date: extracted.date,
        amount: extracted.amount,
        merchant: extracted.merchant,
        category: extracted.suggestedCategory,
        subcategory: extracted.suggestedSubcategory,
      };
      session.waitingForConfirmation = true;
      sessions.set(chatId, session);

      // Send extracted data for confirmation
      const confirmMsg =
        `✅ *Receipt Extracted*\n\n` +
        `📅 Date: ${extracted.date}\n` +
        `💰 Amount: $${extracted.amount.toFixed(2)}\n` +
        `🏪 Merchant: ${extracted.merchant}\n` +
        `📂 Category: ${extracted.suggestedCategory}\n` +
        `🏷️ Subcategory: ${extracted.suggestedSubcategory}\n\n` +
        `Confirm to save? (Reply with /confirm or /cancel)`;

      await this.bot.sendMessage(chatId, confirmMsg, { parse_mode: 'Markdown' });
    } catch (error: any) {
      console.error('Photo processing error:', error);
      await this.bot.sendMessage(
        chatId,
        `❌ Error: ${error.message}\nPlease try again with a clearer receipt photo.`
      );
    }
  }

  private async handleConfirmation(msg: Message) {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    if (!session?.lastReceipt || !session.waitingForConfirmation) {
      await this.bot.sendMessage(chatId, '❌ No pending receipt to confirm.');
      return;
    }

    try {
      const receipt = session.lastReceipt;

      // Determine sheet name
      const [year, month, day] = receipt.date.split('-');
      const monthNum = parseInt(month);
      const monthName = new Date(parseInt(year), monthNum - 1).toLocaleString('default', {
        month: 'long',
      });
      const sheetName = `${monthName} ${year}`;

      // Save to Google Sheets
      await appendTransaction(sheetName, {
        date: receipt.date,
        amount: receipt.amount,
        category: receipt.category,
        subcategory: receipt.subcategory,
        description: receipt.merchant,
      });

      session.waitingForConfirmation = false;
      sessions.set(chatId, session);

      await this.bot.sendMessage(
        chatId,
        `✅ *Transaction Saved!*\n\n` +
          `📅 ${receipt.date}\n` +
          `💰 $${receipt.amount.toFixed(2)}\n` +
          `🏪 ${receipt.merchant}\n\n` +
          `Added to "${sheetName}" sheet.`
      );
    } catch (error: any) {
      console.error('Confirmation error:', error);
      await this.bot.sendMessage(
        chatId,
        `❌ Error saving transaction: ${error.message}`
      );
    }
  }

  private async handleCancel(msg: Message) {
    const chatId = msg.chat.id;
    const session = sessions.get(chatId);

    if (session) {
      session.waitingForConfirmation = false;
      sessions.set(chatId, session);
    }

    await this.bot.sendMessage(chatId, '❌ Cancelled.');
  }

  public start() {
    console.log('Budget Bot is running...');
  }
}
