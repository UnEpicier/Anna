import { StatusCodes } from "http-status-codes";
import request from "supertest";
import type { Schedule } from "@/api/schedules/schedulesModel";
import { schedule } from "@/api/schedules/schedulesRepository";
import type { ServiceResponse } from "@/commons/models/serviceResponse";
import app from "@/server";

describe("Schedules API Endpoints", () => {
	describe("GET /schedules", () => {
		it("should return schedules object", async () => {
			// Act
			const response = await request(app).get("/schedules");
			const responseBody: ServiceResponse<Schedule[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("Schedules found");

			for (let i = 0; i < responseBody.responseObject.length; i++) {
				compareSchedule(schedule, responseBody.responseObject[i]);
			}
		});
	});

	describe("PUT /schedules/:day", () => {
		it("should update schedule for a specific day", async () => {
			// Arrange
			const dayToUpdate = "monday";
			const updatedSchedule: Partial<Schedule> = {
				open: false,
			};

			// Act
			const response = await request(app).put(`/schedules/${dayToUpdate}`).send(updatedSchedule);
			const responseBody: ServiceResponse<Schedule> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain("Schedule updated successfully");

			if (responseBody.responseObject) {
				expect(responseBody.responseObject.day).toEqual(dayToUpdate);
				expect(responseBody.responseObject.open).toEqual(updatedSchedule.open);
			} else {
				throw new Error("Invalid test data: responseBody.responseObject is undefined");
			}
		});
	});
});

function compareSchedule(mockSchedule: Schedule, responseSchedule: Schedule) {
	if (!mockSchedule || !responseSchedule) {
		throw new Error("Invalid test data: mockSchedule or responseSchedule is undefined");
	}

	expect(responseSchedule.day).toEqual(mockSchedule.day);
	expect(responseSchedule.startTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
	expect(responseSchedule.endTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
	expect(responseSchedule.open).toEqual(mockSchedule.open);
}
