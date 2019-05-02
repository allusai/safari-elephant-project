const frisby = require('frisby');

const { Joi } = frisby;
//const Joi = frisby.Joi;

it('should return a status of 200 when cameras are found', () => {
	return frisby
				.get('http://localhost:1234/cameras')
				.expect('status', 200);
});

it('should return a status of 200 when the recharging list is found', () => {
	return frisby
				.get('http://localhost:1234/rechargeList')
				.expect('status', 200);
});

it('should return a status of 200 for adding a ranger', () => {
	return frisby
				.post('http://localhost:1234/addRanger', 
							{
    						firstName : 'Roger',
    						lastName : 'Rescuer',
   							username : 'roger@usc.edu',
   							password : 'elephantsaver'
							}                                
															)
				.expect('status', 200);
});

it('should return a status of 200 when the camera with id 3 is found', () => {
	return frisby
				.delete('http://localhost:1234/cameras/3')
				.expect('status', 200);
});

it('should return a 200 status code after patching the camera location', () => {
	return frisby
				.patch('http://localhost:1234/cameras/2', 

				{xLocation : '121.2', yLocation: '143.2'}                      
															
															)
				.expect('status', 200);
});