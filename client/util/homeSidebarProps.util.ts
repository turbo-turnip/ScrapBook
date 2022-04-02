export const homeSidebarProps: 
  Array<{
    options: Array<{
      title: string;
      tooltip: string;
      emoji: string;
      link?: string;
      selected?: boolean;
    }>;
    title: string;
  }> = [
    {
      title: "Discover",
      options: [
        {
          title: "Feed",
          tooltip: "New and cool posts from all your joined communities!",
          emoji: "☝️",
          link: "/home"
        },
        {
          title: "Communities",
          tooltip: "See what's goin' on in your communities!",
          emoji: "👀",
          link: "/communities"
        },
        {
          title: "Friends",
          tooltip: "Add new friends, and view your current ones!",
          emoji: "⭐️",
          link: "/friends"
        },
        {
          title: "Messages",
          tooltip: "Message people you know, or talk with your friends!",
          emoji: "📨",
          link: "/messages"
        },
        {
          title: "Account",
          tooltip: "View your account and manage your user settings!",
          emoji: "⚙️",
          link: "/account"
        }
      ]
    },
    {
      title: "More",
      options: [
        {
          title: "Folders",
          tooltip: "Manage your post and event folders",
          emoji: "📁",
          link: "/folders"
        }
      ]
    }
  ];

// Returns homeSidebarProps, but adds the selected field to a specific option in a category
export const getSidebarPropsWithOption = (optionTitle: string) => {
  return homeSidebarProps.map(prop => {
    return {
      title: prop.title,
      options: prop.options.map(option => ({ ...option, selected: option.title === optionTitle }))
    }
  });
}