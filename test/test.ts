// todo: fix tests

import "dotenv/config.js";
import { describe, it } from "node:test";
import WolframAlphaAPI from "../dist/index.js";

const appid = process.env.APPID!;

describe("Constructor", () => {
	it("set appid in constructor", () => {
		expect(WolframAlphaAPI(appid)).to.have.property("appid", appid);
	});
	it("appid must not be empty", () => {
		expect(() => WolframAlphaAPI()).to.throw(TypeError);
	});
	it("appid must be string", () => {
		expect(() => WolframAlphaAPI(2)).to.throw(TypeError);
	});
});
describe("Methods", () => {
	let waApi = WolframAlphaAPI(appid);

	describe("#getFull", () => {
		it("must be called with string or object", () => {
			expect(waApi.getFull()).to.eventually.be.rejectedWith(TypeError);
			expect(waApi.getFull(2)).to.eventually.be.rejectedWith(TypeError);
		});
		it("can handle basic strings", () => {
			return expect(waApi.getFull("2+2")).to.eventually.have.property("success", true);
		});
		it("can handle basic object", () => {
			return expect(waApi.getFull({ input: "2+2" })).to.eventually.have.property("success", true);
		});
		it("alias i to input", () => {
			return expect(waApi.getFull({ i: "2+2" })).to.eventually.have.property("success", true);
		});
		it("handle xml output", () => {
			return expect(
				waApi.getFull({
					i: "2+2",
					output: "xml"
				})
			).to.eventually.have.string("<queryresult");
		});
		it("can handle multiple parameters", () => {
			return expect(
				waApi.getFull({
					i: "2+2",
					format: "plaintext",
					includepodid: "Result"
				})
			).to.eventually.have.deep.property("pods[0].subpods[0].plaintext", "4");
		});
		it("does not succeed if input is nonsense", () => {
			return expect(waApi.getFull("F9TVlu5AmVzL")).to.eventually.have.property("success", false);
		});
		it("does not succeed if input is ambiguous", () => {
			return expect(waApi.getFull("What is the prettiest flower")).to.eventually.have.property("success", false);
		});
		it("does not succeed if input is empty", () => {
			return expect(waApi.getFull("")).to.eventually.have.property("success", false);
		});
	});
	describe("#getSimple", () => {
		it("must be called with string or object", () => {
			expect(waApi.getSimple()).to.eventually.be.rejectedWith(TypeError);
			expect(waApi.getSimple(2)).to.eventually.be.rejectedWith(TypeError);
		});
		it("can handle basic strings", () => {
			return expect(waApi.getSimple("2+2")).to.eventually.match(/^data:image\/[a-z]{3,4};base64,/);
		});
		it("can handle basic object", () => {
			return expect(waApi.getSimple({ i: "2+2" })).to.eventually.match(/^data:image\/[a-z]{3,4};base64,/);
		});
		it("can handle multiple parameters", () => {
			return expect(
				waApi.getSimple({
					i: "2+2",
					background: "333333",
					foreground: "white"
				})
			).to.eventually.match(/^data:image\/[a-z]{3,4};base64,/);
		});
		it("fails correctly if input is nonsense", () => {
			return expect(waApi.getSimple("F9TVlu5AmVzL")).to.eventually.be.rejectedWith(
				"Wolfram|Alpha did not understand your input"
			);
		});
		it("fails correctly if input is ambiguous", () => {
			return expect(waApi.getSimple("What is the prettiest flower")).to.eventually.be.rejectedWith(
				"Wolfram|Alpha did not understand your input"
			);
		});
		it("fails correctly if input is empty", () => {
			return expect(waApi.getSimple("")).to.eventually.be.rejectedWith("Wolfram|Alpha did not understand your input");
		});
	});
	describe("#getShort", () => {
		it("must be called with string or object", () => {
			expect(waApi.getShort()).to.eventually.be.rejectedWith(TypeError);
			expect(waApi.getShort(2)).to.eventually.be.rejectedWith(TypeError);
		});
		it("can handle basic strings", () => {
			return expect(waApi.getShort("2+2")).to.become("4");
		});
		it("can handle basic object", () => {
			return expect(waApi.getShort({ i: "2+2" })).to.become("4");
		});
		it("can handle multiple parameters", () => {
			return expect(
				waApi.getShort({
					i: "Eiffel Tower | height",
					units: "metric"
				})
			).to.become("324 meters");
		});
		it("fails correctly if input is nonsense", () => {
			return expect(waApi.getShort("F9TVlu5AmVzL")).to.eventually.be.rejectedWith(
				"Wolfram|Alpha did not understand your input"
			);
		});
		it("fails correctly if input is ambiguous", () => {
			return expect(waApi.getSimple("What is the prettiest flower")).to.eventually.be.rejectedWith(
				"Wolfram|Alpha did not understand your input"
			);
		});
		it("fails correctly if input is empty", () => {
			return expect(waApi.getShort("")).to.eventually.be.rejectedWith("Wolfram|Alpha did not understand your input");
		});
	});
	describe("#getSpoken", () => {
		it("must be called with string or object", () => {
			expect(waApi.getSpoken()).to.eventually.be.rejectedWith(TypeError);
			expect(waApi.getSpoken(2)).to.eventually.be.rejectedWith(TypeError);
		});
		it("can handle basic strings", () => {
			return expect(waApi.getSpoken("2+2")).to.become("The answer is 4");
		});
		it("can handle basic object", () => {
			return expect(waApi.getSpoken({ i: "2+2" })).to.become("The answer is 4");
		});
		it("can handle multiple parameters", () => {
			return expect(
				waApi.getSpoken({
					i: "Eiffel Tower | height",
					units: "metric"
				})
			).to.become("The answer is about 324 meters");
		});
		it("fails correctly if input is nonsense", () => {
			return expect(waApi.getSpoken("F9TVlu5AmVzL")).to.eventually.be.rejectedWith(
				"Wolfram Alpha did not understand your input"
			);
		});
		it("fails correctly if input is ambiguous", () => {
			return expect(waApi.getSpoken("What is the prettiest flower")).to.eventually.be.rejectedWith(
				"Wolfram Alpha did not understand your input"
			);
		});
		it("fails correctly if input is empty", () => {
			return expect(waApi.getSpoken("")).to.eventually.be.rejectedWith("Wolfram Alpha did not understand your input");
		});
	});
});
