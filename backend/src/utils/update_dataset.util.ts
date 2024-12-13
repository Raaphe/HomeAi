import axios from 'axios';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { config } from '../config/config';

async function updateDataset(datasetPath: string): Promise<void> {
    const datasetUrl = `https://www.kaggle.com/api/v1/datasets/download/ahmedshahriarsakib/usa-real-estate-dataset`;
    const dataPath = path.join(__dirname, datasetPath);
    const zipPath = path.join(dataPath, 'dataset.zip');

    try {
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        console.log('Downloading dataset...');
        const response = await axios({
            method: 'get',
            url: datasetUrl,
            responseType: 'stream',
            auth: {
                username: config.KAGGLE_USERNAME,
                password: config.KAGGLE_KEY,
            },
        });

        await new Promise<void>((resolve, reject) => {
            const fileStream = fs.createWriteStream(zipPath);
            response.data.pipe(fileStream);
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        console.log('Dataset downloaded successfully. Extracting...');

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(zipPath)
                .pipe(unzipper.Extract({ path: dataPath }))
                .on('close', resolve)
                .on('error', reject);
        });

        console.log('Dataset extracted successfully.');

        const files = fs.readdirSync(dataPath);
        for (const file of files) {
            const oldFilePath = path.join(dataPath, file);
            if (fs.lstatSync(oldFilePath).isFile() && file !== 'dataset.zip') {
                const newFilePath = path.join(dataPath, `realtor-data.zip.csv`);
                fs.renameSync(oldFilePath, newFilePath);
                console.log(`Renamed ${file} to renamed_${file}`);
            }
        }

        fs.unlinkSync(zipPath);
        console.log('Temporary ZIP file deleted.');
    } catch (error) {
        console.error(`Error during dataset update: ${(error as Error).message}`);
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
    }
}

export async function runDatasetUpdate(): Promise<void> {
    try {
        await updateDataset('../data/datasets');
        console.log('Dataset update job completed successfully');
    } catch (error) {
        console.error('Error updating dataset:', error);
    }
}
