import Comment from "../models/Comment.js";

const commentController = {
    createComment: async (req, res) => {
        try {
          const { productId, userId, username, content, parentId } = req.body;
      
          const imageUrls = req.files?.map((file) => `/assets/${file.filename}`) || [];
      
          if (!content && imageUrls.length === 0) {
            return res.status(400).json({ error: "Bình luận cần có nội dung hoặc ảnh." });
          }
      
          const newComment = new Comment({
            productId,
            userId,
            username,
            content,
            images: imageUrls,
            parentId: parentId || null,
          });
      
          const saved = await newComment.save();
          res.status(201).json(saved);
        } catch (err) {
          res.status(400).json({ error: "Lỗi khi tạo bình luận" });
        }
      },
      

  getCommentsByUser: async (req, res) => {
    try {
      const comments = await Comment.find({ userId: req.params.userId }).sort({
        createdAt: -1,
      });
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },

  getCommentsTreeByProduct: async (req, res) => {
    try {
      const productId = req.params.productId;
      const comments = await Comment.find({ productId }).sort({ createdAt: 1 });

      const commentMap = {};
      comments.forEach((c) => {
        commentMap[c._id] = { ...c._doc, replies: [] };
      });

      const tree = [];
      comments.forEach((c) => {
        if (c.parentId) {
          commentMap[c.parentId]?.replies.push(commentMap[c._id]);
        } else {
          tree.push(commentMap[c._id]);
        }
      });

      res.json(tree);
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi lấy danh sách bình luận" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (!content && (!images || images.length === 0)) {
        return res
          .status(400)
          .json({ error: "Bình luận phải có nội dung hoặc ảnh." });
      }

      const updated = await Comment.findByIdAndUpdate(
        req.params.commentId,
        { content, images, updatedAt: new Date() },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Lỗi khi cập nhật bình luận" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.commentId);
      res.json({ message: "Comment deleted" });
    } catch (err) {
      res.status(400).json({ error: "Failed to delete comment" });
    }
  },
};

export default commentController;
