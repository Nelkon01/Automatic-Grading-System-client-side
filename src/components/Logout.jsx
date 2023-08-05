function Logout() {
    localStorage.removeItem('userLoginStatus');
    window.location.href = '/login';

    return <div></div>;
}
export default Logout;
