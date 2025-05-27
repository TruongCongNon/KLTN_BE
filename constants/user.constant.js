export const getDefaultAvatar = (username = "User") => {
    const encodedName = encodeURIComponent(username.trim());
    return `https://ui-avatars.com/api/?name=${encodedName}&background=cccccc&color=ffffff&rounded=true`;
  };  