const Document = require('../models/DocumentModel');

// create a function to insert a new document here :
exports.createDocument= async(req, res)=>{
    try {
        const document = await Document.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                document
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


// function to get all the documents by senderId

exports.getAllDocumentsBySenderId=async (req,res)=>{

    try{
        const documents = await Document.find({sender:req.params.senderId});
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

// function to get all the documents by receiverId
exports.getAllDocumentsByReceiverId=async (req, res)=>{
    try{
        const documents = await Document.find({receiver:req.params.receiverId});
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}



// create a function to delete a document by id here :
exports.deleteDocumentById=async (req, res)=>{
    try{
        await Document.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}


// create a function to get all document by sender and receiver id
exports.getAllDocumentsBySenderAndReceiverId=async (req, res)=>{
    try{
        const documents = await Document.find({sender:req.params.senderId,receiver:req.params.receiverId});
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}



exports.getNumberOfDocumentsByReceiverId = async (req, res) => {
    try {
        const count = await Document.countDocuments({ receiver: req.params.receiverId });
        res.status(200).json(count);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}


// function to get the perecentage of file type 
exports.getPercentageOfFileType = async (req, res) => {
    try {
      
        const documents = await Document.find({});
        const fileTypes = documents.map(doc => doc.fileType);

        const uniqueFileTypes = [...new Set(fileTypes)];
        const percentage = uniqueFileTypes.map(type => {
            const count = fileTypes.filter(t => t === type).length;
            return { type, count: (count / documents.length) * 100 };
        });
        res.status(200).json(percentage);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}



