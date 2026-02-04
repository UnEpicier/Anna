import { StatusCodes } from "http-status-codes";
import request from "supertest";
import type { Informations } from "@/api/informations/informationsModel";
import { informations } from "@/api/informations/informationsRepository";
import type { ServiceResponse } from "@/commons/models/serviceResponse";
import app from "@/server";

describe("Informations API Endpoints", () => {
	describe("GET /informations", () => {
		it("should return informations object", async () => {
			// Act
			const response = await request(app).get("/informations");
			const responseBody: ServiceResponse<Informations> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("Informations found");
			compareInformations(informations as Informations, responseBody.responseObject);
		});
	});

	describe("PUT /informations", () => {
		it("should update and return the updated informations object", async () => {
			// Arrange
			const updateData: Partial<Informations> = {
				phone: "0987654321",
				address: "456 New St, New City, NY",
			};

			// Act
			const response = await request(app).put("/informations").send(updateData);
			const responseBody: ServiceResponse<Informations> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("Informations updated successfully");
			if (responseBody.responseObject) {
				expect(responseBody.responseObject.phone).toEqual(updateData.phone);
				expect(responseBody.responseObject.address).toEqual(updateData.address);
				compareInformations({ ...informations, ...updateData }, responseBody.responseObject);
			} else {
				throw new Error("Response object is undefined");
			}
		});
	});
});

function compareInformations(mockInformations: Informations, responseInformations: Informations) {
	if (!mockInformations || !responseInformations) {
		throw new Error("Invalid test data: mockInformations or responseInformations is undefined");
	}

	expect(responseInformations.id).toEqual(mockInformations.id);
	expect(responseInformations.email).toEqual(mockInformations.email);
	expect(responseInformations.phone).toEqual(mockInformations.phone);
	expect(responseInformations.address).toEqual(mockInformations.address);
	expect(responseInformations.actionAddress).toEqual(mockInformations.actionAddress);
	expect(responseInformations.actionLong).toEqual(mockInformations.actionLong);
	expect(responseInformations.actionLat).toEqual(mockInformations.actionLat);
	expect(responseInformations.actionRadius).toEqual(mockInformations.actionRadius);
}
