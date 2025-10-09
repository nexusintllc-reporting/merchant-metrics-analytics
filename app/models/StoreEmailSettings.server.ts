
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateStoreEmailSettingsInput {
  shop: string;
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  additionalEmails?: string[];
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
  accessToken?: string;
}

export interface UpdateStoreEmailSettingsInput {
  fromEmail?: string;
  fromName?: string;
  enabled?: boolean;
  additionalEmails?: string[];
  scheduleEnabled?: boolean;
  scheduleTime?: string;
  timezone?: string;
  sendGridApiKey?: string;
  accessToken?: string;
}

// Helper function to convert UTC time to any timezone
function convertUTCToTimezone(utcTime: string, timezone: string): string {
  try {
    const [hours, minutes] = utcTime.split(':').map(Number);
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(utcDate);
    const hour = parts.find(part => part.type === 'hour')?.value.padStart(2, '0') || '00';
    const minute = parts.find(part => part.type === 'minute')?.value.padStart(2, '0') || '00';
    
    return `${hour}:${minute}`;
  } catch (error) {
    console.error(`Error converting UTC ${utcTime} to ${timezone}:`, error);
    return utcTime;
  }
}

export const StoreEmailSettings = {
  async get(shop: string) {
    try {
      const settings = await prisma.storeEmailSettings.findUnique({
        where: { shop },
      });
      
      if (settings) {
        return {
          ...settings,
          additionalEmails: settings.additionalEmails || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error retrieving email settings:', error);
      throw new Error('Failed to retrieve email settings');
    }
  },

  async create(input: CreateStoreEmailSettingsInput) {
    try {
      return await prisma.storeEmailSettings.create({
        data: {
          shop: input.shop,
          fromEmail: input.fromEmail || "info@nexusbling.com",
          fromName: input.fromName || "Store",
          enabled: input.enabled ?? true,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
          accessToken: input.accessToken || null,
        },
      });
    } catch (error) {
      console.error('Error creating email settings:', error);
      throw new Error('Failed to create email settings');
    }
  },

  async update(shop: string, input: UpdateStoreEmailSettingsInput) {
    try {
      return await prisma.storeEmailSettings.upsert({
        where: { shop },
        update: {
          fromEmail: input.fromEmail,
          fromName: input.fromName,
          enabled: input.enabled,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled,
          scheduleTime: input.scheduleTime,
          timezone: input.timezone,
          sendGridApiKey: input.sendGridApiKey,
          accessToken: input.accessToken,
        },
        create: {
          shop,
          fromEmail: input.fromEmail || "info@nexusbling.com",
          fromName: input.fromName || "Store",
          enabled: input.enabled ?? true,
          additionalEmails: input.additionalEmails || [],
          scheduleEnabled: input.scheduleEnabled ?? false,
          scheduleTime: input.scheduleTime || "09:00",
          timezone: input.timezone || "UTC",
          accessToken: input.accessToken || null,
        },
      });
    } catch (error) {
      console.error('Error updating email settings:', error);
      throw new Error('Failed to update email settings');
    }
  },

  async isEnabled(shop: string) {
    try {
      const settings = await this.get(shop);
      return settings?.enabled ?? true;
    } catch (error) {
      console.error('Error checking if email is enabled:', error);
      return true;
    }
  },

  async getShopsWithScheduledReports() {
    try {
      const shops = await prisma.storeEmailSettings.findMany({
        where: {
          enabled: true,
          scheduleEnabled: true,
        },
        select: {
          shop: true,
          scheduleTime: true,
          timezone: true,
          fromEmail: true,
          fromName: true,
          additionalEmails: true,
          accessToken: true,
        },
      });

      return shops.map(shop => ({
        ...shop,
        additionalEmails: shop.additionalEmails || []
      }));
    } catch (error) {
      console.error('Error retrieving shops with scheduled reports:', error);
      throw new Error('Failed to retrieve shops with scheduled reports');
    }
  },

  async getShopsDueForReportsInAllTimezones(currentUTCTime: string) {
    try {
      console.log(`🔍 Checking all timezones for UTC time: ${currentUTCTime}`);
      
      const allShops = await prisma.storeEmailSettings.findMany({
        where: {
          enabled: true,
          scheduleEnabled: true,
        },
        select: {
          shop: true,
          scheduleTime: true,
          timezone: true,
          fromEmail: true,
          fromName: true,
          additionalEmails: true,
          accessToken: true,
        },
      });

      const dueShops = [];
      
      for (const shop of allShops) {
        try {
          const shopLocalTime = convertUTCToTimezone(currentUTCTime, shop.timezone);
          
          console.log(`🔍 Shop ${shop.shop}: UTC ${currentUTCTime} -> ${shop.timezone} ${shopLocalTime}, Scheduled: ${shop.scheduleTime}`);
          
          if (shop.scheduleTime === shopLocalTime) {
            console.log(`🎯 Shop ${shop.shop} is due!`);
            dueShops.push({
              ...shop,
              additionalEmails: shop.additionalEmails || []
            });
          }
        } catch (error) {
          console.error(`❌ Error processing timezone for shop ${shop.shop}:`, error);
        }
      }

      console.log(`📊 Found ${dueShops.length} shops due across all timezones`);
      return dueShops;
      
    } catch (error) {
      console.error('Error retrieving shops due for reports:', error);
      throw new Error('Failed to retrieve shops due for reports');
    }
  },

  async updateAccessToken(shop: string, accessToken: string) {
    try {
      return await prisma.storeEmailSettings.update({
        where: { shop },
        data: { accessToken },
      });
    } catch (error) {
      console.error('Error updating access token:', error);
      throw new Error('Failed to update access token');
    }
  },
};