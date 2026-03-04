import ArticleModel from '../models/article';
import crypto from 'crypto';

export class Article {
  async saveArticle(payload: {
    articleId?: string;
    title?: string;
    slug?: string;
    author?: string;
    category?: number | string | null;
    contentJson?: string;
    contentHtml?: string;
    isFeatured?: boolean;
    status?: string;
    featuredImage?: string;
  }) {
    try {
      const {
        articleId,
        title,
        slug,
        author,
        category,
        contentJson,
        contentHtml,
        isFeatured,
        status,
        featuredImage,
      } = payload;

      // If no articleId, create new draft
      if (!articleId) {
        const newArticleId = crypto.randomUUID();
        const newArticle = new ArticleModel({
          articleId: newArticleId,
          title: title || '',
          slug: slug || '',
          author: author || '',
          category: category || null,
          contentJson: contentJson || '',
          contentHtml: contentHtml || '',
          isFeatured: isFeatured || false,
          status: status || 'draft',
          featuredImage: featuredImage || '',
          createdAt: new Date(),
        });
        const savedArticle = await newArticle.save();

        return {
          success: true,
          message: 'Draft article created successfully',
          data: savedArticle,
          articleId: newArticleId,
        };
      }

      // If articleId exists, update the article
      if (articleId) {
        const existingArticle = await ArticleModel.findOne({ articleId });
        if (!existingArticle) {
          return {
            success: false,
            message: 'Article not found - invalid article ID',
          };
        }

        // Validate required fields for published status
        const newStatus = status || existingArticle.status;
        if (newStatus === 'published') {
          const newContentHtml =
            contentHtml !== undefined ? contentHtml : existingArticle.contentHtml;
          const newFeaturedImage =
            featuredImage !== undefined ? featuredImage : existingArticle.featuredImage;

          if (!newContentHtml) {
            return {
              success: false,
              message: 'contentHtml is required for published articles',
            };
          }
          if (!newFeaturedImage) {
            return {
              success: false,
              message: 'featuredImage is required for published articles',
            };
          }
        }

        // Clean up payload to avoid empty string for category
        const updatePayload: any = { ...payload };
        if (
          !updatePayload.category ||
          updatePayload.category === '' ||
          updatePayload.category === null
        ) {
          updatePayload.category = null;
        }

        const updatedArticle = await ArticleModel.findOneAndUpdate(
          { articleId },
          { $set: updatePayload },
          { new: true }
        );

        return {
          success: true,
          message: 'Article updated successfully',
          data: updatedArticle,
        };
      }
    } catch (error) {
      console.error('Save article error:', error);
      return {
        success: false,
        message: 'An error occurred while saving article',
      };
    }
  }
}
