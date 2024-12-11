import fs from 'fs/promises';

export default class fileUtil {
    static async checkFileExists(filePath: string): Promise<boolean> {
      try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return false;
        }
        throw error;
      }
    }
}