// @ts-nocheck (to ignore typechecking on validation function parameters)
export const yupLocale = {
	mixed: {
		//   default: {
		//       key: 'validations.invalid',
		//   },
		required: {
			key: "validations.required"
		},
		notType: ({ type }) => ({
			key: "validations.invalidType",
			values: { type }
		})
	},
	string: {
		email: {
			key: "validations.emailFormat"
		},
		min: ({ min }) => ({
			key: "validations.minString",
			values: { min }
		}),
		max: ({ max }) => ({
			key: "validations.maxString",
			values: { max }
		})
	},
	date: {
		min: ({ min }) => ({
			key: "validations.minDate",
			values: { min }
		}),
		max: ({ max }) => ({
			key: "validations.maxDate",
			values: { max }
		})
	},
	number: {
		min: ({ min }) => ({
			key: "validations.minNumber",
			values: { min }
		}),
		max: ({ max }) => ({
			key: "validations.maxNumber",
			values: { max }
		})
	}
}
