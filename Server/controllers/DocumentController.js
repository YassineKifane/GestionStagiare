const Document = require('../models/DocumentModel');
// Create a function to insert a new document
exports.createDocument = async (req, res) => {
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
            message: err.message
        });
    }
};

// Function to get all documents by senderId
exports.getAllDocumentsBySenderId = async (req, res) => {
    try {
        const documents = await Document.findAll({ where: { sender: req.params.senderId } });
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Function to get all documents by receiverId
exports.getAllDocumentsByReceiverId = async (req, res) => {
    try {
        const documents = await Document.findAll({ where: { receiver: req.params.receiverId } });
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create a function to delete a document by id
exports.deleteDocumentById = async (req, res) => {
    try {
        const documentId = req.params.id;
        console.log(`Attempting to delete document with ID: ${documentId}`);

        const result = await Document.destroy({ where: { id: documentId } });

        if (result) {
            console.log(`Document with ID ${documentId} deleted successfully.`);
            return res.status(204).json({
                status: 'success',
                data: null
            });
        } else {
            console.log(`Document with ID ${documentId} not found.`);
            return res.status(404).json({
                status: 'fail',
                message: 'Document not found'
            });
        }
    } catch (err) {
        console.error('Error deleting document:', err);
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        });
    }
};


// Create a function to get all documents by sender and receiver id
exports.getAllDocumentsBySenderAndReceiverId = async (req, res) => {
    try {
        const documents = await Document.findAll({ where: { sender: req.params.senderId, receiver: req.params.receiverId } });
        res.status(200).json({
            status: 'success',
            data: {
                documents
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get document by ID
exports.getDocumentById = async (req, res) => {
    try {
        // Log the DocumentId parameter
        console.log('Requested DocumentID:', req.params.id);
        
        // Attempt to find the document by the provided ID
        const document = await Document.findOne({ where: { id: req.params.id } });

        // Check if an intern was found
        if (!document) {
            // Log the case where no intern was found
            console.log('Document not found with DocumentId:', req.params.id);
            return res.status(404).json({ message: 'Document not found' });
        }

        // Respond with the found document
        res.json(document);
    } catch (error) {
        // Log the error message for troubleshooting
        console.error('Error retrieving document:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Function to get the number of documents by receiverId
exports.getNumberOfDocumentsByReceiverId = async (req, res) => {
    try {
        const count = await Document.count({ where: { receiver: req.params.receiverId } });
        res.status(200).json(count);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Function to get the percentage of file type
exports.getPercentageOfFileType = async (req, res) => {
    try {
        const documents = await Document.findAll();
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
};
