/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const Book = require("../models");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        if (!books) {
          return res.json([]);
        }

        const response = books?.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            commentcount: book.commentcount,
          };
        });

        res.json(response);
      } catch (error) {
        console.log(error);
        res.json("An error occurred");
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including at least _id and title
      if (!title) {
        return res.json("missing required field title");
      }

      try {
        let book = await Book.findOne({ title });
        if (book) {
          return res.json("Book already exists");
        }

        book = await Book.create({ title });
        res.json({ _id: book._id, title: book.title });
      } catch (error) {
        console.log(error);
        res.json("An error occurred");
        return;
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        const deleteBooks = await Book.deleteMany();
        if (deleteBooks.deletedCount === 0) {
          return res.json("No books to delete");
        }

        res.json("complete delete successful");
      } catch (error) {
        console.log(error);
        res.json("An error occurred");
        return;
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      if (!bookId) {
        return res.json("missing required field id");
      }

      try {
        let book = await Book.findById({ _id: bookId });
        if (!book) {
          return res.json("no book exists");
        }

        if (book.comments.length === 0) {
          book.comments = [];
        }

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        console.log(error);
        res.json("no book exists");
        return;
      }
    })

    .post(async function (req, res) {
      let bookId = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!bookId) {
        return res.json("missing required field id");
      }

      if (!comment) {
        return res.json("missing required field comment");
      }

      try {
        const book = await Book.findById({ _id: bookId });
        if (!book) {
          return res.json("no book exists");
        }

        book.comments.push(comment);
        book.commentcount = book.comments.length;
        await book.save();

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        console.log(error);
        res.json("no book exists");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!bookid) {
        return res.json("missing required field id");
      }

      try {
        const deleteBook = await Book.findById({ _id: bookid });
        if (!deleteBook) {
          return res.json("no book exists");
        }

        await Book.findByIdAndDelete({ _id: bookid });
        res.json("delete successful");
      } catch (error) {
        console.log(error);
        res.json("no book exists");
      }
    });
};
