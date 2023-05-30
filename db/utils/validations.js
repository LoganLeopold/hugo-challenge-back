const dummyApp = {
  customer: {
    lastname: "test",
    firstname: 'tester',
    birthday: '09/24/1990',
    street: '319 Queen St.',
    city: "Washington",
    state: 'District Of Columbia',
    zipcode: 20003
  },
  vehicles: [
    {
      vin: "TJ45HJKJHJK123432",
      year:	2010,
      make:	"Honda",
      model: "Insight",
    },
    {
      vin: "TOYAVENUE",
      year:	2020,
      make:	"Chrysler",
      model: "Plymouth",
    }
  ]
}

const validateCustomer = (customerObject) => {
  const lengthMap = {
    lastname: 255,
    firstname: 255,
    birthday: 10,
    street: 255,
    city: 255,
    state: 75,
  }

  // lengths
  const keys = Object.keys(lengthMap)
  let validLengths = true // decides valid lengths
  for (i = 0; i < keys.length; i++) {
    const field = keys[i]
    const maxLength = lengthMap[field];
    const data = customerObject[field];
    if (maxLength < data.length) {
      validLengths = false
      break;
    }
  }
  console.log(`Customer validLengths: ${validLengths}`)

  // birthday
  let validBirthday = true;
  const birthday = customerObject['birthday']
  const bdayRegex = new RegExp(/([0][1-9]|[1][012])\/([0][1-9]|[12][0-9]|[3][01])\/(19|20)[0-9][0-9]/);
  const regTest = bdayRegex.test(birthday) 

  if (regTest === false) validBirthday === false; 

  let now = new Date().getTime()
  let bday = new Date(birthday).getTime();
  let ageInMils = now - bday // milliseconds difference

  let age = 
    ageInMils // milliseconds
    / 1000 // to seconds
    / 60 // to minutes
    / 60 // to hours
    / 24 // to days
    / 365 // to years
    
  if (age < 16) validBirthday === false;

  console.log(`Customer validBirthday: ${validBirthday}`)

  // zipcode
  let validZipcode = true;
  const zipcode = customerObject['zipcode'];
  if (typeof zipcode != 'number' || zipcode > 99999) validZipcode = false
  console.log(`Customer validZipcode: ${validZipcode}`);
  console.log(`Customer result: ${validLengths && validBirthday && validZipcode}`)

  return validLengths && validBirthday && validZipcode;
}

const validateVehicle = (vehicleObject) => {
  const lengthMap = {
    vin: 225,
    make: 150,
    model: 150,
  }

  // lengths
  const keys = Object.keys(lengthMap)
  let validLengths = true // decides valid lengths
  for (i = 0; i < keys.length; i++) {
    const field = keys[i]
    const maxLength = lengthMap[field];
    const data = vehicleObject[field];
    if (maxLength < data.length) {
      validLengths = false
      break;
    }
  }

  console.log(`Vehicle ${vehicleObject.vin} validLengths: ${validLengths}`)

  // year
  let validYear = true;
  let year = vehicleObject.year;
  if (year > new Date().getFullYear() || year < 1900) validYear = false;
  console.log(`Vehicle ${vehicleObject.vin} validYear: ${validYear}`)
  console.log(`Vehicle ${vehicleObject.vin} result: ${validLengths && validYear}`)
  
  return validLengths && validYear;
}

const validateApp = (appBody) => {
  // console.log(appBody);
  const { customer, vehicles } =  appBody;
  const validCustomer = validateCustomer(customer);
  const vehicleAssesments = vehicles.map( (vehicle) => {
    const valid = validateVehicle(vehicle);
    return valid;
  })
  const validVehicles = !vehicleAssesments.includes(false);
  return validCustomer && validVehicles;
}

console.log(validateApp(dummyApp));

module.exports = {
  validateApp
}