
// Types

type AuthNavigationType = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    Splash: undefined;
};
// type TabNavigationType = {
//     Home: undefined
// }

type SplashNavigationType = {
    Welcome: undefined;
}
type ScreenNavigationType = {
    CoinDetails: { coinUuid: string }; // Màn hình CoinDetails nhận tham số `coinUuid`
};
type HomeNavigationType = {
    HomeScreen: undefined;
    CoinDetail: undefined;
}
type SearchNavigationType = {
    SearchScreen: undefined;
}
