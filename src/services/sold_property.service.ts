import fs from 'fs';
import csv from 'csv-parser';
import { ISoldProperty } from "../interfaces/sold_property.interface.ts";
import { config } from "../config/config.ts";

export class SoldPropertyService {
    private allProperties?: ISoldProperty[];
    private static instance: SoldPropertyService;

    private constructor() {
        this.readCsvAndMap(config.DATASET_PATH).catch(err => console.error('Error in reading CSV in constructor:', err));
    }

    getAllProperties(): ISoldProperty[] | undefined {
        return this.allProperties;
    }

    isPropertiesReady(): boolean {
        return this.allProperties !== undefined && this.allProperties.length > 0;
    }

    public static getInstance(): SoldPropertyService {
        if (!SoldPropertyService.instance) {
            SoldPropertyService.instance = new SoldPropertyService();
        }
        return SoldPropertyService.instance;
    }

    private readCsvAndMap(filePath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const properties: ISoldProperty[] = [];

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row: any) => {
                    const price = parseFloat(row.price);
                    const bed = parseInt(row.bed);
                    const bath = parseInt(row.bath);
                    const acre_lot = parseFloat(row.acre_lot);
                    const street = parseInt(row.street);
                    const house_size = parseFloat(row.house_size);

                    if (
                        !isNaN(price) && price > 0 &&
                        !isNaN(bed) && bed > 0 &&
                        !isNaN(bath) && bath > 0 &&
                        !isNaN(acre_lot) && acre_lot > 0 &&
                        !isNaN(street) && street > 0 &&
                        row.city && row.city.trim() !== '' &&
                        row.state && row.state.trim() !== '' &&
                        row.zip_code && row.zip_code.trim() !== ''
                    ) {
                        const property: ISoldProperty = {
                            price,
                            bed,
                            bath,
                            acre_lot,
                            street,
                            city: row.city,
                            state: row.state,
                            zip_code: row.zip_code,
                            house_size,
                        };

                        properties.push(property);
                    }
                })
                .on('end', () => {
                    this.allProperties = properties;
                    console.log('CSV file successfully processed');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                });
        });
    }
}
