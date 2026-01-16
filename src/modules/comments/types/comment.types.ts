export interface Comment {
  id: string
  text: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name?: string
    channel?: {
      handle: string
      avatarPath?: string
    }
  }
}

export interface CreateCommentDto {
  text: string
  videoId: string
}

export interface CommentsResponse {
  comments: Comment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
