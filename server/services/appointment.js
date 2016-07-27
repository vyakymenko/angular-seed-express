var nodemailer = require('nodemailer');

module.exports = function(app) {

  function appointmentMail(req, res) {

    /**
     * Email will be send from:
     * @user `a.zwinczewska@gmail.com`
     * @pass `bardzoproste123`
     */
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'a.zwinczewska@gmail.com',
        pass: 'bardzoproste123'
      }
    });

    var mailOptions = {
      from: req.body.email,
      // to: 'paluchkoslawy@hallux.med.pl',
      to: 'rayfesoul@gmail.com',
      subject: '( '+ req.body.name +' ) Appoitment Proposition Time: ' + req.body.proposeDate,
      html: '' +
      'Appointment proposition from: <b>'+ req.body.name +'</b><br>' +
      'Phone number: <b>'+ req.body.phone +'</b><br>' +
      'Email: <b>'+ req.body.email +'</b><br>' +
      'Propose date: <b>'+ req.body.proposeDate + '</b><br>' +
      'Message from user: <b>'+ req.body.message +'</b>',
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
        res.json({yo: 'error'});
      }else{
        console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
      };
    });
  }

  // app.post('/api/appointment', appointmentMail);
};
