const express = require("express");
const cors = require("cors");
const {MongoClient} = require("mongodb");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'aprasadforwork1@gmail.com',
        pass: 'yrwauobdmesenctu'
    }
});

app.post("/subscribe",(req,res)=>{
    const url = "mongodb+srv://aparnaprasad2004:VDI92dl0060JkgjO@easysubscriber31jul24.m8lwjed.mongodb.net/?retryWrites=true&w=majority&appName=easysubscriber31jul24";
    const client = new MongoClient(url);
    const db = client.db("emailsubs30jul24");
    const coll = db.collection("subscriber");
    const record = { _id: req.body.email };
    coll.findOne(record)
    .then(existingRecord => {
        if (existingRecord) {
            res.send({ message: "- Email already subscribed" });
        } else {
            coll.insertOne(record)
                .then(result => {
                    const mailOptions = {
                        from: 'aprasadforwork1@gmail.com',
                        to: record._id,
                        subject: 'Subscription Successful',
                        text: 'Thank you for subscribing!'
                    };

                    transporter.sendMail(mailOptions)
                        .then(info => {
                            res.send({ message: "- Subscription successful"});
                        })
                        .catch(error => {
                            res.send({ message: "- Subscription successful but failed to send email"});
                        });
                })
                .catch(error => res.send({ message: "- Subscription failed" }));
        }
    })
    .catch(error => res.send({ message: "- Subscription failed" }));
});

app.post("/unsubscribe",(req,res)=>{
    const url = "mongodb+srv://aparnaprasad2004:VDI92dl0060JkgjO@easysubscriber31jul24.m8lwjed.mongodb.net/?retryWrites=true&w=majority&appName=easysubscriber31jul24";
    const client = new MongoClient(url);
    const db = client.db("emailsubs30jul24");
    const coll = db.collection("subscriber");
    const record = { _id: req.body.email };
    coll.findOne(record)
        .then(existingRecord => {
            if (existingRecord) {
                coll.deleteOne(record)
                    .then(result => {
                        const mailOptions = {
                            from: 'aprasadforwork1@gmail.com',
                            to: record._id,
                            subject: 'Unsubscription Successful',
                            text: 'You have successfully unsubscribed.'
                        };

                        transporter.sendMail(mailOptions)
                            .then(info => {
                                res.send({ message: "- Unsubscription successful" });
                            })
                            .catch(error => {
                                res.send({ message: "- Unsubscription successful but failed to send email" });
                            });
                    })
                    .catch(error => res.send({ message: "- Unsubscription failed" }));
            } else {
                res.send({ message: "- Email not subscribed" });
            }
        })
        .catch(error => res.send({ message: "- Unsubscription failed" }));
});

app.listen(9000,()=>{ console.log("server ready @9000"); });