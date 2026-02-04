import { createHash } from "node:crypto";

export function hash(input: string): string {
	return createHash("sha512").update(input).digest("hex");
}
