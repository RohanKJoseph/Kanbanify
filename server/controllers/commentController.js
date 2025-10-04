const {
  getCommentsFromDB,
  createCommentToDB,
  deleteCommentFromDB,
} = require("../db/commentDB");

class CommentController {
  getComments = async (req, res) => {
    const cardId = req.params.cardId;
    const comments = await getCommentsFromDB(cardId);
    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
  };

  createComment = async (req, res) => {
    const { content } = req.body;
    const cardId = req.params.cardId;
    const userId = req.user.id;
   try {
     const comment = await createCommentToDB(content, cardId, userId);
    res.status(200).json({ message: "Comment created successfully", comment });
   }catch (error) {
     res.status(500).json({ message: "Error creating comment", error: error.message });
   }
  };

  deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const comment = await deleteCommentFromDB(commentId);
    res.status(200).json({ message: "Comment deleted successfully", comment });
    }catch (error) {
      res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
  };
}

module.exports = new CommentController();
