import { spawn } from 'child_process';

function updateDataset(scriptPath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const pyprog = spawn('python', [scriptPath]);

        pyprog.stdout.on('data', (data: Buffer) => {
            resolve(data);
        });

        pyprog.stderr.on('data', (data: Buffer) => {
            reject(new Error(data.toString()));
        });

        pyprog.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });

        pyprog.on('error', (err) => {
            reject(err);
        });
    });
}

export async function runDatasetUpdate () {
    try {
        await updateDataset('src/utils/download_dataset.util.py');
        console.log('Dataset update job completed successfully');
    } catch (error) {
        console.error('Error updating dataset:', error);
    }
}