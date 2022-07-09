const router = require('express').Router();

let books = [
    {
      id: 1,
      title: "Harry Potter and the Philosopher's Stone",
      reviews: [
        {
          id: 1,
          comment: "Nice"
        }
      ]
    },
    {
      id: 2,
      title: "Harry Potter and the Chamber of Secretse",
      reviews: [
        {
          id: 1,
          comment: "This is my favourite book!"
        },
        {
          id: 2,
          comment: "Facinating story!!!"
        }
      ]
    },
    {
      id: 3,
      title: "Dune",
      reviews: [
        {
          id: 1,
          comment: "Can`t wait for ecranisation"
        }
      ]
    },
    {
      id: 4,
      title: "Martin Eden",
      reviews: [
        {
          id: 1,
          comment: "Perfect book"
        }
      ]
    }
  ]

router.get('/', (req, res) => {
    res.json(books)
})

router.post('/', (req, res) => {
    const book = {
        id: books.length + 1,
        title: req.body.title,
        reviews: []
    }
    books.push(book);
    res.json(book);
})

const checkIfBookExist = (req, res, next) => {
    const book = books.find(item => item.id === +req.params.id);
    if (!book) {
        return next({status: 404, message: "book not found"});
    }
    req.book = book;
    next();
}

const checkIfCommentExist = (req, res, next) => {
    let comment = false;
    const index = books.findIndex(item => item.id === +req.params.id);
    const book = books[index];
    book.reviews.forEach(review => {
        if(review.id === +req.params.reviewId) {
            comment = true;
        }
    })
    if (!comment) {
        return next({status: 404, message: "review not found"});
    }
    next();
}

router.get('/:id', checkIfBookExist, (req, res) => {
    res.json(req.book);
})

router.put('/:id', checkIfBookExist, (req, res) => {
    let updatedBook = {};
    books = books.map(book => {
        if(book.id === +req.params.id) {
            updatedBook = {...book, title: req.body.title};
            return updatedBook;
        } else return book;
    })
    res.json(updatedBook)
})

router.post('/:id/reviews', checkIfBookExist, (req, res) => {
    let reviews = [];
    books = books.map(book => {
        if(book.id === +req.params.id) {
            reviews = book.reviews;
            reviews.push({
                id: book.reviews.length + 1,
                comment: req.body.comment
            });
            updatedBook = {...book, reviews};
            return updatedBook;
        } else return book;
    });
    res.json(reviews[reviews.length - 1])
})

router.delete('/:id/reviews/:reviewId', checkIfBookExist, checkIfCommentExist, (req, res) => {
    const book = books.find(item => item.id === +req.params.id);
    const review = book.reviews;
    const index = review.findIndex(e => e.id === +req.params.reviewId);
    const deletedElement = review[index];
    let updatedReview = review.slice(0, index).concat(review.slice(index + 1));
    book.reviews = updatedReview;
    res.json(deletedElement);
})

router.get('/:id/reviews', checkIfBookExist, (req, res) => {
    const book = books.find(item => item.id === +req.params.id);
    const reviews = book.reviews;
    if (reviews.length <= 0 ) {
        res.json({"message": "no reviews yet"})
    } else {
        res.json(reviews);
    }
})

module.exports = router;