export const hiddenEmail = (email) => {
    var at = email.indexOf("@");
    var username = email.substring(1, at - 1);
    var asterisk = '*'.repeat(username.length);
    var hidden = email.replace(username, asterisk);

    return (hidden);
}