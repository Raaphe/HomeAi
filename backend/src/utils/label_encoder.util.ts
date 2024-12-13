export default class LabelEncoder {

    private labelMap: Map<string, number> = new Map();
    private inverseLabelMap: Map<number, string> = new Map();

    fit(labels: string[]): void {
        labels.forEach((l, index) => {
            if (!this.labelMap.has(l)) {
                this.labelMap.set(l, index);
                this.inverseLabelMap.set(index, l);
            }
        });
    }

    transform(label: string) : number {
        if (!this.labelMap.has(label) || !this.labelMap.get(label)) {
            throw new Error(`Label, "${label}" was not seen during fitting`);
        }
        return this.labelMap.get(label) ?? 0;
    }

    inverseTransform(encodedLabel: number) : string {
        if (!this.inverseLabelMap.has(encodedLabel)) {
            throw new Error(`Encoded label "${encodedLabel}" was not seen during fitting.`);
        }
        return this.inverseLabelMap.get(encodedLabel)!
    }
}