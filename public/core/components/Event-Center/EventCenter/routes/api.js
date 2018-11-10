//all routes will go here

const express = require('express');
const router = express.Router();

// Include our Form schema
const Form = require('../models/form')

// This route POSTs
router.post('/form', (req,res) => {
	Form.create(req.body)
	.then(newForm => {
		// return json response
		res.json({
			confirmation: 'Successful',
			data: newForm
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		})
	})
});

// This route GETs
router.get('/form', (req,res) => {
	// Get query from url
	const query = req.query

	// query every forms in our db
	Form.find(query)
	.then(forms => {
		// return json response
		res.json({
			confirmation: 'Successful',
			data: forms
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		})
	})
});

// This route UPDATES
router.post('/form/update/:id', (req, res) => {
	const id = req.params.id;
	Form.findByIdAndUpdate(id, req.body, {new: true})
	.then(updatedForm => {
		// return successful response
		res.json({
			confirmation: 'Successful',
			form: updatedForm
		});
	})
	.catch (err => {
		// return unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		});
	});	
  });
  
// This route DELETES
router.get('/form/remove/:id', (req,res) => {
	console.log("in delete route with id:" + req.params.id)
	Form.findByIdAndRemove(req.params.id)
	.then(updatedForm => {
		// return successful response
		res.json({
			confirmation: 'Successful',
			form:  updatedForm
		});
	})
	.catch (err => {
		// return unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		});
	});	
  });

  // To handle query GETS an ID
  // Should return items matching the id in the parameter passed
  router.get('/form/:id', (req,res) => {
	const id = req.params.id;
	console.log("received id: " + id);
	Form.findById(id)
	.then(forms => {
		// return json successful response
		res.json({
			confirmation: 'Successful',
			data: forms
		})
	})
	.catch (err => {
		// return json unsuccessful response
		res.json({
			confirmation: 'Unsuccessful',
			message: err.message
		})
	})
});


module.exports = router;