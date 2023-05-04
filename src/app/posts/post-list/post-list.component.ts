import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSub: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage =5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  constructor(public postService: PostService, private authService: AuthService){}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener().subscribe((postData:{posts: Post[]; postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
   this.authStatusSub = this.authService
    .getAuthStatus()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex +1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPosts(this.postPerPage,this.currentPage);
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
