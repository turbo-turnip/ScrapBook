
# ScrapBook

ScrapBook is an open-source social media platform with privacy, so you can connect with your friends and communities online, without worrying about data collection, ads, and tracking algorithms.


## Features

- Join communities, create posts and discussions with other community members!
- Follow users and open DMs with them. Create group DMs with multiple followers.
- Heart, comment on, and add emoji reactions to posts.
- Create boxes and fill them with posts or DMs you like or want to save for later.
- Create emoji packages and control your XP pet.
- Level up your XP pet for creating posts, DMs, and staying active.
- Gift XP pet features and customization options to other followers.
- Customize your XP pet and watch them grow! Create community XP pets to watch the community grow!
- **More features coming with later updates.**


## Development Roadmap

| Task                                                                                | Completed |
|-------------------------------------------------------------------------------------|-----------|
| Work on frontend and backend for auth with JWTs                                     | true      |
| Add interests for users                                                             | true      |
| Store communities in Prisma 2 MySQL database and push when new community is created | true      |
| View/follow user profiles and manage user settings                                  | false     |
| Create, add/remove \[group] DMs with other followers                                | false     |
| Create posts and discussions in communities                                         | true      |
| Add functionality for hearts, comments, and reactions on posts                      | true      |
| Create XP pets and customization options for them                                   | false     |
| Add levels and gifting for XP pets and customizations                               | false     |
| Add information pages                                                               | false     |
| Add UI animations to frontend                                                       | false     |
| Add reCAPTCHA to submission forms                                                   | false     |

## Known Bugs / Things to fix

- Add activity status
- Fix signup page interest regex, failed at "C++"
- Implement use of verification for users
- Make interests fields not required in community forms
- Creating user avatar field uses old default value
- Add limit for user interests and community interests
- Refine interest search algorithm
- Use getStaticProps for auth and page fetches
- Use getStaticPaths for communities and messages pages
- Banned refresh token duplicate insert errors - Implement fix: return response fields when requests fail
- Establish useEffect cleanup
- Fix memory leaks on page switches
- Fix prisma schema unique constraint on community member communityID and userID
- Clean up popups in array, not being used
- Add dates to posts and other things
- Spread types in postTypes util into separate files
- Destroy images when posts deleted
- Add input field limits based on database field string limits
- Add necessary try/catch to prisma queries code
- Add service functions for controllers
- Liking/commenting/actions on posts reset state for showComments and showFolders
- Pass account state to useEffect dependencies when calling initial fetch requests after authentication (/client/pages/communities/settings/\[community\].tsx:96)

## Future possible features

- Post deletion folder
- Edit banner images/background color for communities
- Support for polls, discussions, and other features on posts

## Support

For support, or to report a bug, submit an issue or email me at att.cubing.sharks@gmail.com.


## Socials

Email: att.cubing.sharks@gmail.com  
Codepen: [@teake_smal](https://codepen.io/teake_smal)  
Github: [@SoftwareFuze](https://github.com/SoftwareFuze)  
Discord: TeaKe_smAL#4826  
Portfolio: (In Development)   


