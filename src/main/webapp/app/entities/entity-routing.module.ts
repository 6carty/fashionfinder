import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-profile',
        data: { pageTitle: 'UserProfiles' },
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
      },
      {
        path: 'clothing-item',
        data: { pageTitle: 'ClothingItems' },
        loadChildren: () => import('./clothing-item/clothing-item.module').then(m => m.ClothingItemModule),
      },
      {
        path: 'outfit',
        data: { pageTitle: 'Outfits' },
        loadChildren: () => import('./outfit/outfit.module').then(m => m.OutfitModule),
      },
      {
        path: 'message',
        data: { pageTitle: 'Messages' },
        loadChildren: () => import('./message/message.module').then(m => m.MessageModule),
      },
      {
        path: 'chatroom',
        data: { pageTitle: 'Chatrooms' },
        loadChildren: () => import('./chatroom/chatroom.module').then(m => m.ChatroomModule),
      },
      {
        path: 'user-milestone',
        data: { pageTitle: 'UserMilestones' },
        loadChildren: () => import('./user-milestone/user-milestone.module').then(m => m.UserMilestoneModule),
      },
      {
        path: 'milestone-type',
        data: { pageTitle: 'MilestoneTypes' },
        loadChildren: () => import('./milestone-type/milestone-type.module').then(m => m.MilestoneTypeModule),
      },
      {
        path: 'event',
        data: { pageTitle: 'Events' },
        loadChildren: () => import('./event/event.module').then(m => m.EventModule),
      },
      {
        path: 'calendar',
        data: { pageTitle: 'Calendars' },
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule),
      },
      {
        path: 'fashion-tip',
        data: { pageTitle: 'FashionTips' },
        loadChildren: () => import('./fashion-tip/fashion-tip.module').then(m => m.FashionTipModule),
      },
      {
        path: 'exchange-request',
        data: { pageTitle: 'ExchangeRequests' },
        loadChildren: () => import('./exchange-request/exchange-request.module').then(m => m.ExchangeRequestModule),
      },
      {
        path: 'purchase-listing',
        data: { pageTitle: 'PurchaseListings' },
        loadChildren: () => import('./purchase-listing/purchase-listing.module').then(m => m.PurchaseListingModule),
      },
      {
        path: 'sale-listing',
        data: { pageTitle: 'SaleListings' },
        loadChildren: () => import('./sale-listing/sale-listing.module').then(m => m.SaleListingModule),
      },
      {
        path: 'rating',
        data: { pageTitle: 'Ratings' },
        loadChildren: () => import('./rating/rating.module').then(m => m.RatingModule),
      },
      {
        path: 'trending-outfit',
        data: { pageTitle: 'TrendingOutfits' },
        loadChildren: () => import('./trending-outfit/trending-outfit.module').then(m => m.TrendingOutfitModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'Posts' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'likes',
        data: { pageTitle: 'Likes' },
        loadChildren: () => import('./likes/likes.module').then(m => m.LikesModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'leaderboard',
        data: { pageTitle: 'Leaderboards' },
        loadChildren: () => import('./leaderboard/leaderboard.module').then(m => m.LeaderboardModule),
      },
      {
        path: 'weather',
        data: { pageTitle: 'Weathers' },
        loadChildren: () => import('./weather/weather.module').then(m => m.WeatherModule),
      },
      {
        path: 'clothing-pic',
        data: { pageTitle: 'ClothingPics' },
        loadChildren: () => import('./clothing-pic/clothing-pic.module').then(m => m.ClothingPicModule),
      },
      {
        path: 'outfit-pic',
        data: { pageTitle: 'OutfitPics' },
        loadChildren: () => import('./outfit-pic/outfit-pic.module').then(m => m.OutfitPicModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
