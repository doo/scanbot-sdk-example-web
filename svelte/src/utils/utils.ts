
export default class Utils {
    public static generateId(): string {
        return (Math.random() + 1).toString(36).substring(7)
    }
}