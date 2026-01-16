// Types
export type { Comment, CreateCommentDto, CommentsResponse } from './types/comment.types'

// Services
export { commentService } from './services/comment.service'

// Hooks
export { useComments, useCreateComment, useDeleteComment } from './hooks/use-comments'
