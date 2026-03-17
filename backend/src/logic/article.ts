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
    mainArticle?: boolean;
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
        mainArticle,
      } = payload;

      // If no articleId, create new draft
      if (!articleId) {
        const newArticleId = crypto.randomUUID();
        // Find the highest current id
        const lastArticle = await ArticleModel.findOne().sort({ id: -1 });
        const nextId = lastArticle && lastArticle.id ? lastArticle.id + 1 : 1;
        const newArticle = new ArticleModel({
          id: nextId,
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
          mainArticle: mainArticle || false,
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

  async getArticles() {
    try {
      const articles = await ArticleModel.find().populate('category');
      return {
        success: true,
        data: articles,
      };
    } catch (error) {
      console.error('Get articles error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching articles',
      };
    }
  }

  async getMainArticle() {
    try {
      const article = await ArticleModel.findOne({ mainArticle: true }).populate('category');
      if (!article) {
        return {
          success: false,
          message: 'Main article not found',
        };
      }
      return {
        success: true,
        data: article,
      };
    } catch (error) {
      console.error('Get main article error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching main article',
      };
    }
  }

  async getArticleById(id: string) {
    try {
      const article = await ArticleModel.findById(id).populate('category');
      if (!article) {
        return {
          success: false,
          message: 'Article not found',
        };
      }
      return {
        success: true,
        data: article,
      };
    } catch (error) {
      console.error('Get article by ID error:', error);
      return {
        success: false,
        message: 'An error occurred while fetching article',
      };
    }
  }

  async changeArticleStatus(id: string) {
    try {
      const article = await ArticleModel.findById(id);
      if (!article) {
        return {
          success: false,
          message: 'Article not found',
        };
      }

      if (article.status === 'published') {
        article.status = 'archived';
      } else if (article.status === 'archived') {
        article.status = 'published';
      } else {
        return {
          success: false,
          message: 'Only published or archived articles can have their status changed this way',
        };
      }

      await article.save();

      return {
        success: true,
        message: `Article status changed to ${article.status}`,
        data: article,
      };
    } catch (error) {
      console.error('Change article status error:', error);
      return {
        success: false,
        message: 'An error occurred while changing article status',
      };
    }
  }
}
