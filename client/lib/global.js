Template.registerHelper('dateFormated', function (date) {
	return moment(date).format('HH:mm:ss YYYY.MM.DD');
});