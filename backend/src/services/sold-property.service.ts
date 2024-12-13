import fs from 'fs';
import csv from 'csv-parser';
import { ISoldProperty } from "../interfaces/sold_property.interface.ts";
import path from "path";

export class SoldPropertyService {
    private properties?: ISoldProperty[];

    getProperties(): ISoldProperty[] | undefined {
        return this.properties;
    }

    public arePropertiesLoaded(): boolean {
        return !!this.properties && this.properties.length > 0;
    }

    public async loadProperties(filePath: string): Promise<void> {
        const properties: ISoldProperty[] = [];
        return new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row: any) => {
                    const property = this.parseProperty(row);
                    if (property) properties.push(property);
                })
                .on('end', () => {
                    this.properties = properties;
                    console.log('Properties loaded successfully');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                });
        });
    }

    private parseProperty(row: any): ISoldProperty | null {
        const price = parseFloat(row.price);
        const bed = parseInt(row.bed);
        const bath = parseInt(row.bath);
        const acreLot = parseFloat(row.acre_lot);
        const street = parseInt(row.street);
        const houseSize = parseFloat(row.house_size);

        const prevSoldDate = row.prev_sold_data ? new Date(row.prev_sold_data) : this.generateRandomDate();

        if (this.isValidProperty(price, bed, bath, acreLot, street, row)) {
            return {
                price,
                bed,
                bath,
                acre_lot: acreLot,
                street,
                city: row.city.trim(),
                state: row.state.trim(),
                zip_code: row.zip_code.trim(),
                house_size: houseSize > 0 ? houseSize : undefined,
                prev_sold_data: prevSoldDate,
            };
        }
        return null;
    }

    private isValidProperty(price: number, bed: number, bath: number, acreLot: number, street: number, row: any): boolean {
        return !isNaN(price) && price > 0 &&
            !isNaN(bed) && bed > 0 && bed < 15 &&
            !isNaN(bath) && bath > 0 && bath < 15 &&
            !isNaN(acreLot) && acreLot > 0 &&
            !isNaN(street) && street > 0 &&
            row.city && row.city.trim() !== '' &&
            row.state && row.state.trim() !== '' &&
            row.zip_code && row.zip_code.trim() !== '';
    }

    private generateRandomDate(): Date {
        const start = new Date(1950, 0, 1).getTime();
        const end = Date.now();
        return new Date(start + Math.random() * (end - start));
    }

    private getPropertiesBySize(numberOfBins: number = 5): { min: number; max: number; count: number }[] {
        if (!this.arePropertiesLoaded()) {
            throw new Error("SoldPropertyService is not ready or properties are not loaded yet.");
        }

        const allProperties = this.getProperties();
        if (!allProperties || allProperties.length === 0) {
            return [];
        }

        const houseSizes = allProperties
            .map((property) => property.house_size)
            .filter((size): size is number => typeof size === 'number' && !isNaN(size) && size > 0);

        if (houseSizes.length === 0) {
            return [];
        }

        const minSize = houseSizes.reduce((min, size) => Math.min(min, size), Number.POSITIVE_INFINITY);
        const maxSize = houseSizes.reduce((max, size) => Math.max(max, size), Number.NEGATIVE_INFINITY);
        const binSize = (maxSize - minSize) / numberOfBins;

        const bins: { min: number; max: number; count: number }[] = [];

        for (let i = 0; i < numberOfBins; i++) {
            const lowerBound = minSize + i * binSize;
            const upperBound = i === numberOfBins - 1 ? maxSize : lowerBound + binSize;

            const count = houseSizes.filter(
                (size) => size >= lowerBound && (i === numberOfBins - 1 ? size <= upperBound : size < upperBound)
            ).length;

            bins.push({
                min: lowerBound,
                max: upperBound,
                count,
            });
        }

        return bins;
    }

    private getAveragePriceByBedrooms(): { bed: number; averagePrice: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const pricesByBedrooms: { [bed: number]: number[] } = {};
        properties.forEach(property => {
            if (property.bed) {
                pricesByBedrooms[property.bed] = pricesByBedrooms[property.bed] || [];
                pricesByBedrooms[property.bed].push(property.price || 0);
            }
        });

        return Object.entries(pricesByBedrooms).map(([bed, prices]) => {
            const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            return { bed: parseInt(bed), averagePrice };
        });
    }

    private getAveragePriceByBathrooms(): { bath: number; averagePrice: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const pricesByBathrooms: { [bath: number]: number[] } = {};
        properties.forEach(property => {
            if (property.bath) {
                pricesByBathrooms[property.bath] = pricesByBathrooms[property.bath] || [];
                pricesByBathrooms[property.bath].push(property.price || 0);
            }
        });

        return Object.entries(pricesByBathrooms).map(([bath, prices]) => {
            const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            return { bath: parseInt(bath), averagePrice };
        });
    }

    private getPropertyCountByState(): { state: string; count: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const countByState: { [state: string]: number } = {};
        properties.forEach(property => {
            if (property.state) {
                countByState[property.state] = (countByState[property.state] || 0) + 1;
            }
        });

        return Object.entries(countByState).map(([state, count]) => ({ state, count }));
    }

    private getAveragePriceByState(): { state: string; averagePrice: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const pricesByState: { [state: string]: number[] } = {};
        properties.forEach(property => {
            if (property.state && property.price) {
                pricesByState[property.state] = pricesByState[property.state] || [];
                pricesByState[property.state].push(property.price);
            }
        });

        return Object.entries(pricesByState).map(([state, prices]) => {
            const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            return { state, averagePrice };
        });
    }

    private getSalesByYear(): { year: string; count: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const salesByYear: { [year: string]: number } = {};
        properties.forEach(property => {
            const year = property.prev_sold_data?.getFullYear().toString();
            if (year) {
                salesByYear[year] = (salesByYear[year] || 0) + 1;
            }
        });

        return Object.entries(salesByYear)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, count]) => ({ year, count }));
    }

    private getPriceRangeByState(): { state: string; minPrice: number; maxPrice: number }[] {
        const properties = this?.getProperties();

        if (!properties)
            return [];

        const priceRangeByState: { [state: string]: { min: number; max: number } } = {};
        properties.forEach(property => {
            if (property.state && property.price) {
                if (!priceRangeByState[property.state]) {
                    priceRangeByState[property.state] = { min: property.price, max: property.price };
                } else {
                    priceRangeByState[property.state].min = Math.min(priceRangeByState[property.state].min, property.price);
                    priceRangeByState[property.state].max = Math.max(priceRangeByState[property.state].max, property.price);
                }
            }
        });

        return Object.entries(priceRangeByState).map(([state, range]) => ({
            state,
            minPrice: range.min,
            maxPrice: range.max
        }));
    }

    public async writeGraphFunctionsToFile(relativePath: string): Promise<void> {
        if (!this || !this.arePropertiesLoaded()) {
            throw new Error("SoldPropertyService is not ready or properties are not loaded yet.");
        }

        console.log("Got into writing graph function");

        const data = {
            priceRangeByState: this.getPriceRangeByState(),
            averagePriceByState: this.getAveragePriceByState(),
            propertyCountByState: this.getPropertyCountByState(),
            propertyCountBySize: this.getPropertiesBySize(),
            averagePriceByBedrooms: this.getAveragePriceByBedrooms(),
            averagePriceByBathrooms: this.getAveragePriceByBathrooms(),
            salesByYear: this.getSalesByYear(),
        };

        const filePath = path.join(__dirname, relativePath);
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log("Graph functions written successfully.");
    }

    public async readPriceRangeByStateFromFile(relativePath: string): Promise<{ state: string; minPrice: number; maxPrice: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.priceRangeByState || [];
        } catch (error) {
            console.error("Error reading price range by state data from file:", error);
            throw error;
        }
    }

    public async readAveragePriceByStateFromFile(relativePath: string): Promise<{ state: string; averagePrice: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.averagePriceByState || [];
        } catch (error) {
            console.error("Error reading average price by state data from file:", error);
            throw error;
        }
    }

    public async readPropertyCountByStateFromFile(relativePath: string): Promise<{ state: string; count: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.propertyCountByState || [];
        } catch (error) {
            console.error("Error reading property count by state data from file:", error);
            throw error;
        }
    }

    public async readPropertyCountBySizeFromFile(relativePath: string): Promise<{ min: number; max: number; count: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.propertyCountBySize || [];
        } catch (error) {
            console.error("Error reading property count by size data from file:", error);
            throw error;
        }
    }

    public async readAveragePriceByBedroomsFromFile(relativePath: string): Promise<{ bed: number; averagePrice: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.averagePriceByBedrooms || [];
        } catch (error) {
            console.error("Error reading average price by bedrooms data from file:", error);
            throw error;
        }
    }

    public async readAveragePriceByBathroomsFromFile(relativePath: string): Promise<{ bath: number; averagePrice: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.averagePriceByBathrooms || [];
        } catch (error) {
            console.error("Error reading average price by bathrooms data from file:", error);
            throw error;
        }
    }

    public async readSalesByYearFromFile(relativePath: string): Promise<{ year: string; count: number }[]> {
        const filePath = path.join(__dirname, relativePath);

        try {
            const data = await fs.promises.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            return parsedData.salesByYear || [];
        } catch (error) {
            console.error("Error reading sales by year data from file:", error);
            throw error;
        }
    }
}
