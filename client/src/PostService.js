import axios from 'axios';

const url = 'api/posts/';

class PostService {
    // Get All Posts
    static getPosts() {
        return new Promise((resolve, reject) => 
        {
            axios.get(url).then((res) => 
            {
                const data = res.data;
                    resolve(
                        data.map(post => ({
                            ...post
                            }))
                        );
                    })
                    .catch((err) => {
                        reject(err);
            })
        });
    }
        // Create Post
    static insertPost(title, label, position, wrapping, text, createdAt, modified) 
    {
        return axios.post(url, { title, label, position, wrapping, text, createdAt, modified});
    }
    // Update a Posts
    static updatePost(id, title, label, position, wrapping, text, modified) 
    {
        return axios.put(`${url}${id}`, { title, label, position, wrapping, text, modified });
    }

    // Delete Post
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;