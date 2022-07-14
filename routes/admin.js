var express = require("express");
var router = express.Router();
const { blogsDB } = require("../mongo");
const { serverCheckBlogIsValid } = require("../utils/validation");

router.get("/blog-list", async function (req, res, next) {
  try {
    const collection = await blogsDB().collection("blogs50");
    const blogs = await collection
      .find({})
      .sort({ id: -1 })
      .project({
        title: 1,
        author: 1,
        createdAt: 1,
        lastModified: 1,
        id: 1,
      })
      .toArray();

    res.status(200).json({ message: blogs, success: true });
  } catch (e) {
    res
      .status(500)
      .json({ message: "error fetching posts" + e, success: false });
  }
});

router.put("/edit-blog", async function (req, res) {
  try {
    const collection = await blogsDB().collection("blogs50");
    const blogId = Number(req.body.id);
    const originalBlog = await collection.findOne({ id: blogId });
    console.log(originalBlog);
    if (!originalBlog) {
      res.status(204).json({
        message:
          "* Blog with ID: " +
          blogId +
          " does not exist... Please enter a valid Blog ID",
        success: false,
      });
    } else {
      const updatedBlogIsValid = serverCheckBlogIsValid(req.body);

      if (!updatedBlogIsValid) {
        res
          .status(400)
          .json({ message: "Blog update is not valid", success: false });
        return;
      }

      const newPostBlog = req.body;
      const date = new Date();
      const updateBlog = { ...newPostBlog, lastModified: date };

      //   updateBlog = {
      //     lastModified: new Date(),
      //     title: newPostBlog.title,
      //     text: newPostBlog.text,
      //     author: newPostBlog.author,
      //     category: newPostBlog.category,
      //   };
      await collection.updateOne(
        {
          id: newPostBlog.id,
        },
        {
          $set: { ...updateBlog },
        }
      );
      res
        .status(200)
        .json({ message: "* Blog Successfully Updated", success: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "* Error updating blog." + error, success: false });
  }
});

router.delete("/delete-blog/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("blogs50");
    const blogToDelete = await collection.deleteOne({ id: blogId });
    console.log(blogToDelete);
    if (blogToDelete.deletedCount === 1) {
      res
        .status(200)
        .json({ message: "Blog Successfully Deleted", success: true });
      console.log("testing delete");
    } else {
      res.status(204).json({ message: "Unsuccessful", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error " + error, success: false });
  }
});

module.exports = router;
