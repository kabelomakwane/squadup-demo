(() => {
  "use strict";

  const PLAYERS = window.SQUAD_UP_PLAYERS || [];
  const POSITIONS = ["ST", "MID", "MID", "DEF", "GK"];
  const STORAGE_KEY = "squad-up-state-v1";
  const MATCH_DURATION_MS = 150000;
  const LOADING_BEAT_MS = 1800;
  const WINNER_REVEAL_MS = 5200;
  const COMMENTARY_MIN_MS = 4800;
  const COMMENTARY_MAX_MS = 10500;
  const COMMENTARY_WORDS_PER_MINUTE = 150;
  const LOADING_LINES = [
    "Buses arriving. Someone forgot the bibs.",
    "Warm-ups underway. Hamstrings negotiating.",
    "Keeper claims they meant that.",
    "Final team talk. Tactics remain classified.",
    "Tunnel ready. Main-character energy activated."
  ];
  const app = document.querySelector("#app");
  const LOGO_SVG = `<svg class="brand-logo" viewBox="0 0 449 119" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Squad Up">
<path d="M18.8854 106.047C11.7812 106.047 5.48958 104.407 0 101.125L3.04167 85.818C5.54688 87.7295 8.21875 89.2972 11.0521 90.516C13.8854 91.7399 17.0938 92.3545 20.6771 92.3545C21.6302 92.3545 22.6302 92.2764 23.6771 92.1305C24.7188 91.9795 25.7031 91.6982 26.6302 91.2764C27.5521 90.8597 28.3594 90.2764 29.0417 89.5316C29.7292 88.7868 30.1927 87.818 30.4323 86.6253C30.5521 85.9066 30.5677 85.2087 30.4792 84.5212C30.3854 83.8337 30.1302 83.2243 29.7135 82.6878C29.1771 81.9118 28.4635 81.3128 27.5677 80.8962C26.6719 80.4795 25.7448 80.1201 24.7917 79.8232C22.1667 78.9274 19.6458 77.8962 17.2292 76.7347C14.8125 75.568 12.724 74.1201 10.9635 72.391C9.20312 70.6618 7.92188 68.5889 7.11458 66.1722C6.30729 63.7555 6.23437 60.8753 6.89062 57.5316C7.54688 54.0732 8.80208 51.1514 10.651 48.7607C12.5 46.3753 14.6771 44.4482 17.1875 42.9899C19.6927 41.5264 22.4479 40.4795 25.4635 39.8545C28.4792 39.2295 31.474 38.917 34.4583 38.917C38.099 38.917 41.6042 39.1982 44.9792 39.766C48.349 40.3337 51.6146 41.3024 54.776 42.6722C54.6563 43.3337 54.5365 44.0055 54.4219 44.6878C54.3021 45.3753 54.1823 46.0472 54.0625 46.7035C53.8229 47.8389 53.526 48.8805 53.1667 49.8337C52.8073 50.792 52.349 51.6097 51.7812 52.2972C51.2135 52.9847 50.4792 53.5212 49.5885 53.9066C48.6927 54.2972 47.5885 54.4899 46.276 54.4899C45.5 54.4899 44.8125 54.4014 44.2135 54.2191C42.3646 53.6826 40.5 53.2503 38.625 52.9222C36.7448 52.5941 34.7865 52.4326 32.7604 52.4326C31.8646 52.4326 30.9688 52.4899 30.0729 52.6097C29.1771 52.7295 28.3594 52.9847 27.6094 53.3701C26.8646 53.7607 26.224 54.2816 25.6875 54.9378C25.151 55.5941 24.7917 56.4587 24.6146 57.5316C24.2552 59.3232 24.7031 60.7243 25.9583 61.7399C27.2083 62.7555 28.849 63.6774 30.8802 64.516C32.9062 65.3493 35.099 66.2295 37.4583 67.1566C39.8125 68.0837 41.9323 69.3024 43.8125 70.8232C45.6927 72.3441 47.125 74.3441 48.1094 76.8232C49.0938 79.2972 49.1979 82.4795 48.4219 86.3545C47.6458 90.2347 46.3021 93.443 44.3958 95.9795C42.4844 98.5107 40.1875 100.526 37.5 102.021C34.8177 103.511 31.8802 104.558 28.6875 105.151C25.4948 105.75 22.224 106.047 18.8854 106.047ZM89.6875 53.2347C86.8229 53.2347 84.375 53.7868 82.3438 54.891C80.3177 56.0003 78.599 57.4587 77.1979 59.2764C75.7969 61.0993 74.6927 63.1566 73.8854 65.4535C73.0833 67.7503 72.4375 70.0941 71.9635 72.4795C71.4844 74.8701 71.2031 77.2139 71.1094 79.5055C71.0208 81.8024 71.3229 83.8649 72.0104 85.6826C72.6927 87.5055 73.8438 88.9639 75.4531 90.068C77.0625 91.1722 79.3021 91.7243 82.1667 91.7243C85.0312 91.7243 87.4792 91.1722 89.5052 90.068C91.5365 88.9639 93.2344 87.5055 94.6094 85.6826C95.9792 83.8649 97.0677 81.8024 97.875 79.5055C98.6823 77.2139 99.3229 74.8701 99.8021 72.4795C100.214 70.0941 100.469 67.7503 100.557 65.4535C100.651 63.1566 100.365 61.0993 99.7083 59.2764C99.0521 57.4587 97.9323 56.0003 96.3542 54.891C94.7708 53.7868 92.5469 53.2347 89.6875 53.2347ZM100.604 99.3337C104.365 101.422 107.599 104.078 110.318 107.297C113.031 110.521 115.104 114.162 116.536 118.219H97.474C97.1719 117.443 96.8125 116.547 96.401 115.537C95.9792 114.521 95.5156 113.537 95.0104 112.578C94.5052 111.625 93.9479 110.745 93.3542 109.938C92.7604 109.136 92.1042 108.495 91.3854 108.016C90.7292 107.599 89.8906 107.256 88.8802 106.985C87.8646 106.719 86.7917 106.521 85.6562 106.407C84.5208 106.287 83.4062 106.193 82.3021 106.136C81.1979 106.073 80.224 106.047 79.3906 106.047C74.2604 106.047 69.875 105.24 66.2344 103.631C62.5938 102.016 59.7135 99.7347 57.599 96.7816C55.4792 93.8285 54.1198 90.292 53.526 86.1774C52.9271 82.0576 53.1042 77.4951 54.0625 72.4795C55.0156 67.4691 56.599 62.9014 58.8073 58.7868C61.0104 54.667 63.7396 51.1305 66.9948 48.1774C70.2448 45.2243 74.0208 42.943 78.3177 41.3337C82.6146 39.7191 87.3281 38.917 92.4583 38.917C97.5938 38.917 101.979 39.7347 105.615 41.3753C109.255 43.0212 112.12 45.318 114.208 48.2712C116.297 51.2243 117.641 54.7607 118.24 58.8753C118.833 62.9951 118.656 67.5264 117.703 72.4795C116.688 77.6149 114.776 82.568 111.974 87.3389C109.167 92.1149 105.38 96.1097 100.604 99.3337ZM145 106.047C140.766 106.047 137.109 105.537 134.036 104.526C130.964 103.511 128.5 101.974 126.651 99.917C124.802 97.8597 123.609 95.2295 123.073 92.0368C122.536 88.8441 122.682 85.0993 123.516 80.8076L131.484 39.8128H149.208L140.974 82.417C140.318 85.7607 140.438 88.1878 141.328 89.7139C142.224 91.2347 144.432 91.9951 147.953 91.9951C149.682 91.9951 151.146 91.8024 152.339 91.4118C153.531 91.0264 154.531 90.443 155.339 89.667C156.146 88.891 156.802 87.9066 157.307 86.7139C157.812 85.5212 158.219 84.0889 158.516 82.417L166.839 39.8128H184.297L176.328 80.8076C174.656 89.4587 171.12 95.8285 165.724 99.917C160.323 104.006 153.411 106.047 145 106.047ZM215.979 57.6253L206.495 78.1201H217.146L215.979 57.6253ZM218.932 105.151L218.036 91.4587H200.406C199.688 93.3649 198.943 95.141 198.167 96.7816C197.391 98.4222 196.453 99.8701 195.349 101.125C194.245 102.375 192.917 103.36 191.365 104.078C189.812 104.792 187.906 105.151 185.635 105.151H176.062L210.609 39.9014H228.333L237.37 105.151H218.932ZM273.891 52.6982H270.042L262.344 92.3493H266.104C269.385 92.3493 272.234 91.8128 274.651 90.7399C277.068 89.667 279.13 88.2035 280.828 86.3545C282.531 84.5055 283.901 82.3128 284.948 79.7764C285.99 77.2399 286.781 74.5107 287.318 71.5889C287.854 68.7191 288.036 66.141 287.854 63.8441C287.677 61.5472 287.047 59.5628 285.974 57.891C284.901 56.2191 283.365 54.9378 281.365 54.042C279.365 53.1462 276.875 52.6982 273.891 52.6982ZM262.526 105.151H242.745L255.365 39.9014H275.146C280.453 39.9014 285.109 40.5107 289.109 41.7347C293.104 42.9587 296.344 44.8545 298.818 47.417C301.297 49.9847 302.938 53.266 303.745 57.266C304.547 61.266 304.417 66.0368 303.339 71.5889C301.073 83.1618 296.536 91.6514 289.734 97.0524C282.932 102.453 273.859 105.151 262.526 105.151ZM351.583 106.047C347.349 106.047 343.693 105.537 340.62 104.526C337.547 103.511 335.083 101.974 333.234 99.917C331.385 97.8597 330.193 95.2295 329.656 92.0368C329.115 88.8441 329.266 85.0993 330.099 80.8076L338.068 39.8128H355.792L347.557 82.417C346.896 85.7607 347.021 88.1878 347.911 89.7139C348.807 91.2347 351.016 91.9951 354.536 91.9951C356.266 91.9951 357.729 91.8024 358.922 91.4118C360.115 91.0264 361.115 90.443 361.922 89.667C362.729 88.891 363.385 87.9066 363.891 86.7139C364.396 85.5212 364.802 84.0889 365.099 82.417L373.422 39.8128H390.875L382.911 80.8076C381.24 89.4587 377.703 95.8285 372.307 99.917C366.906 104.006 359.995 106.047 351.583 106.047ZM420.146 52.3441H415.583L411.823 71.4066H416.385C418.057 71.4066 419.667 71.2451 421.219 70.917C422.771 70.5889 424.203 70.0524 425.516 69.3024C426.828 68.5576 427.948 67.542 428.875 66.2607C429.797 64.9795 430.438 63.3805 430.797 61.4691C431.156 59.6253 431.094 58.0993 430.62 56.9066C430.141 55.7139 429.396 54.792 428.38 54.1305C427.365 53.4743 426.13 53.016 424.667 52.7451C423.203 52.4743 421.698 52.3441 420.146 52.3441ZM409.406 84.1201L407.078 96.1982C406.542 99.0055 404.901 101.245 402.156 102.912C399.651 104.407 397.052 105.151 394.37 105.151H388.016L400.724 39.8128H421.667C425.25 39.8128 428.771 40.068 432.229 40.5732C435.693 41.0785 438.703 42.0784 441.271 43.568C443.839 45.0628 445.745 47.167 447 49.8805C448.25 52.5941 448.464 56.1618 447.625 60.5785C446.49 66.3076 444.24 71.1097 440.87 74.9847C437.495 78.8649 432.828 81.4951 426.859 82.8649C423.818 83.5785 420.875 83.9691 418.042 84.0264C415.208 84.0889 412.328 84.1201 409.406 84.1201Z" fill="#F1C72F"/>
<path d="M275.984 17.0521C276.072 16.6198 275.994 16.2396 275.609 16C275.39 15.8594 275.104 15.7552 274.827 15.7448L273.135 15.6979L272.239 18.8698L273.932 18.8438C274.984 18.7604 275.765 18.099 275.984 17.0521ZM276.416 12.6354C276.88 12.375 277.166 11.9479 277.229 11.4427C277.348 10.9323 277.025 10.4583 276.51 10.4375L274.65 10.375L273.911 13.0104L275.202 12.9792C275.624 12.9688 276.036 12.8594 276.416 12.6354ZM277.64 14.1615C278.744 14.5938 279.51 15.5521 279.343 16.776C279.229 17.6406 278.921 18.4635 278.463 19.2083C277.807 20.2813 276.749 20.9479 275.525 21.2448C274.76 21.4167 274.015 21.4844 273.208 21.4844L267.843 21.5052L271.755 7.75521H276.307L278.374 7.93229C279.588 8.15104 280.749 8.86458 280.729 10.1198C280.692 12.0104 279.437 13.4896 277.64 14.1615ZM290.025 13.1094L289.156 16.0938L284.171 16.0885L283.499 18.4219L289.098 18.4271L288.572 20.3073C288.338 21 287.76 21.4427 287.01 21.5052L278.937 21.5L282.854 7.75H291.942L291.374 9.73438C291.255 10.0573 290.999 10.3021 290.687 10.4427C290.385 10.6042 290.062 10.6875 289.708 10.6771H285.708L285.015 13.1042L290.025 13.1094ZM304.213 7.71354C304.218 7.75521 304.213 7.79167 304.202 7.82812L303.4 10.6823L299.609 10.6875L296.947 20.0781C296.77 20.901 296.109 21.5 295.265 21.5H292.692L295.775 10.6875L291.994 10.6823L292.843 7.73438L304.213 7.71354ZM171.791 0C171.796 0.0208333 171.817 0.046874 171.854 0.0520833C172.525 0.145833 173.124 0.401042 173.619 0.859375C174.557 1.72396 174.656 3.125 173.739 4.07812C172.525 5.34375 170.374 5.375 169.104 4.17188C168.088 3.21354 168.166 1.72917 169.171 0.828125C169.692 0.359376 170.307 0.140625 170.973 0H171.791ZM144.536 30.3177V30.3854H144.119V30.3229L144.536 30.3177Z" fill="#F1C730"/>
<path d="M144.535 30.318L144.118 30.3232C143.634 30.0889 144.071 29.4847 144.577 29.0212C145.79 27.9222 148.827 26.1097 150.426 25.2191L159.79 19.9795C161.16 19.2139 162.488 18.4743 163.785 17.5993C164.613 17.0368 165.926 16.1045 165.926 15.1878C165.926 13.818 164.473 13.1462 163.202 12.8389C160.759 12.2503 157.493 12.4482 154.889 12.5576C153.676 12.6097 152.525 12.6618 151.316 12.6097C150.014 12.5472 148.124 12.1722 147.801 10.891C147.629 10.1878 147.795 9.47429 148.124 8.84408C149.342 6.49512 153.071 4.79721 155.551 3.87533C157.806 3.042 160.082 2.40658 162.441 1.95866C163.754 1.70866 164.983 1.51075 166.035 2.417C166.837 3.1045 167.603 4.30762 167.269 5.30762C167.071 5.917 166.092 6.24512 165.353 6.24512C162.764 6.25554 160.238 6.50033 157.717 7.08887C156.374 7.40137 154.212 8.01596 153.196 8.77637C153.129 8.83366 153.17 8.96908 153.207 9.00554C153.249 9.03679 153.332 9.10971 153.426 9.09929L156.525 8.78158C160.035 8.42221 166.426 8.24512 168.936 10.8649C170.077 12.0628 170.629 13.7399 170.4 15.3857C170.306 16.0628 169.973 16.6566 169.577 17.1982C168.821 18.2347 167.853 19.0212 166.743 19.6774C165.478 20.4326 164.196 21.0524 162.853 21.693L152.67 26.5316L145.525 29.9587C145.181 30.1253 144.874 30.3076 144.535 30.318Z" fill="#DB1C14"/>
<path d="M176.827 21.7345C175.4 21.7345 174.156 21.3908 173.104 20.7137L173.942 17.5418C174.421 17.9377 174.932 18.2606 175.484 18.5158C176.036 18.7658 176.671 18.896 177.39 18.896C177.583 18.896 177.786 18.8804 177.999 18.8491C178.213 18.8179 178.416 18.7606 178.604 18.672C178.796 18.5835 178.968 18.4637 179.119 18.3127C179.265 18.1564 179.374 17.9585 179.442 17.7085C179.479 17.5627 179.489 17.4168 179.484 17.271C179.473 17.1304 179.432 17.0054 179.354 16.8908C179.26 16.7345 179.124 16.6095 178.947 16.521C178.775 16.4325 178.593 16.3595 178.406 16.297C177.895 16.1147 177.4 15.9012 176.932 15.6564C176.463 15.4168 176.062 15.12 175.734 14.7606C175.406 14.4012 175.182 13.9689 175.057 13.4689C174.932 12.9689 174.958 12.3752 175.14 11.6825C175.322 10.9637 175.619 10.3595 176.025 9.86475C176.432 9.36995 176.9 8.96891 177.426 8.66683C177.952 8.36475 178.52 8.146 179.14 8.021C179.755 7.89079 180.364 7.82308 180.963 7.82308C181.697 7.82308 182.395 7.88037 183.067 8.00016C183.734 8.11995 184.38 8.31787 184.994 8.60433C184.958 8.73975 184.926 8.88037 184.89 9.021C184.859 9.16162 184.822 9.30225 184.791 9.43766C184.723 9.67204 184.65 9.89079 184.562 10.0887C184.479 10.2866 184.374 10.4533 184.249 10.5939C184.124 10.7397 183.968 10.8491 183.781 10.9325C183.598 11.0106 183.374 11.0522 183.109 11.0522C182.952 11.0522 182.817 11.0314 182.697 10.995C182.333 10.8856 181.963 10.797 181.593 10.7293C181.218 10.6564 180.827 10.6252 180.421 10.6252C180.239 10.6252 180.057 10.6356 179.874 10.6616C179.697 10.6877 179.525 10.7397 179.369 10.8179C179.213 10.9012 179.077 11.0106 178.958 11.1408C178.843 11.2814 178.755 11.4585 178.702 11.6825C178.604 12.0522 178.676 12.3439 178.911 12.5522C179.15 12.7606 179.463 12.9533 179.859 13.1304C180.255 13.3022 180.682 13.4845 181.145 13.6772C181.604 13.8647 182.015 14.12 182.369 14.4325C182.723 14.7502 182.984 15.1616 183.145 15.6772C183.307 16.1929 183.281 16.8491 183.062 17.6512C182.848 18.4585 182.531 19.12 182.109 19.646C181.687 20.172 181.197 20.5887 180.635 20.896C180.072 21.2085 179.463 21.422 178.812 21.547C178.161 21.672 177.499 21.7345 176.827 21.7345ZM225.827 21.5522C224.4 21.5522 223.156 21.2137 222.098 20.5314L222.942 17.3595C223.416 17.7554 223.932 18.0835 224.484 18.3335C225.036 18.5887 225.671 18.7137 226.39 18.7137C226.583 18.7137 226.786 18.6981 226.999 18.6668C227.208 18.6356 227.411 18.5783 227.604 18.495C227.796 18.4064 227.968 18.2866 228.119 18.1304C228.265 17.9741 228.374 17.7762 228.442 17.5262C228.473 17.3804 228.489 17.2345 228.479 17.0939C228.473 16.9533 228.432 16.8231 228.354 16.7137C228.26 16.5522 228.124 16.4272 227.947 16.3439C227.775 16.2554 227.593 16.1825 227.406 16.12C226.895 15.9325 226.4 15.7189 225.932 15.4793C225.463 15.2397 225.062 14.9377 224.734 14.5783C224.406 14.2241 224.182 13.7918 224.057 13.2918C223.926 12.7918 223.958 12.1929 224.14 11.5002C224.322 10.7866 224.619 10.1772 225.025 9.68245C225.432 9.18766 225.9 8.79183 226.426 8.48975C226.952 8.18766 227.52 7.96891 228.14 7.8387C228.755 7.7085 229.364 7.646 229.963 7.646C230.692 7.646 231.395 7.70329 232.067 7.81787C232.734 7.93766 233.38 8.14079 233.994 8.42204C233.958 8.55746 233.926 8.69808 233.89 8.8387C233.859 8.98454 233.822 9.11996 233.791 9.25537C233.723 9.49496 233.65 9.7085 233.562 9.90641C233.479 10.1043 233.369 10.2762 233.249 10.4168C233.124 10.5575 232.968 10.672 232.781 10.7502C232.593 10.8335 232.369 10.87 232.109 10.87C231.952 10.87 231.812 10.8543 231.697 10.8127C231.333 10.7033 230.963 10.6147 230.588 10.547C230.218 10.4793 229.827 10.4429 229.416 10.4429C229.239 10.4429 229.057 10.4585 228.874 10.4793C228.692 10.5054 228.525 10.5575 228.369 10.6408C228.213 10.7189 228.077 10.8283 227.958 10.9637C227.843 11.0991 227.755 11.2814 227.702 11.5002C227.604 11.87 227.676 12.1616 227.911 12.37C228.145 12.5835 228.463 12.7762 228.859 12.9481C229.255 13.12 229.682 13.3022 230.145 13.495C230.604 13.6877 231.015 13.9429 231.369 14.2554C231.723 14.5731 231.984 14.9845 232.145 15.5002C232.301 16.0106 232.281 16.672 232.062 17.4741C231.848 18.2762 231.531 18.9429 231.109 19.4637C230.687 19.9897 230.197 20.4064 229.635 20.7189C229.072 21.0262 228.463 21.245 227.812 21.3647C227.161 21.4897 226.499 21.5522 225.827 21.5522ZM189.067 20.6564C188.13 21.3595 187.156 21.7137 186.145 21.7137C185.593 21.7137 185.13 21.6356 184.76 21.4845C184.385 21.3283 184.109 21.0887 183.926 20.7658C183.744 20.4481 183.661 20.0262 183.676 19.5054C183.687 18.9897 183.786 18.37 183.973 17.6512L185.468 11.9012H188.744L187.296 17.4689C187.213 17.8127 187.161 18.0887 187.15 18.2918C187.135 18.495 187.15 18.646 187.208 18.745C187.291 18.9325 187.531 19.0262 187.926 19.0262C188.27 19.0262 188.635 18.8752 189.02 18.5783C189.4 18.3075 189.635 18.0002 189.734 17.6512L191.229 11.9012H194.593L192.536 19.7658C192.468 20.0262 192.348 20.2658 192.176 20.4793C192.005 20.6981 191.801 20.8804 191.572 21.0366C191.338 21.1929 191.077 21.3179 190.796 21.4064C190.515 21.5002 190.229 21.547 189.937 21.547H188.859L189.067 20.6564ZM199.895 14.3127C199.702 14.3127 199.51 14.3543 199.301 14.4272C199.098 14.5002 198.906 14.5991 198.723 14.7241C198.541 14.8491 198.38 14.9897 198.244 15.1512C198.104 15.3075 198.01 15.4845 197.963 15.6668L197.385 17.8908C197.338 18.0783 197.338 18.2554 197.385 18.422C197.432 18.5887 197.515 18.7345 197.635 18.8595C197.749 18.9793 197.895 19.0783 198.062 19.1564C198.234 19.2293 198.411 19.2658 198.604 19.2658C198.916 19.2658 199.192 19.1929 199.432 19.0418C199.671 18.896 199.88 18.7033 200.057 18.4689C200.234 18.2345 200.385 17.9689 200.51 17.672C200.635 17.3752 200.734 17.0783 200.817 16.7814C200.9 16.4741 200.958 16.1668 200.989 15.87C201.025 15.5783 201.015 15.3075 200.958 15.0731C200.906 14.8387 200.796 14.6564 200.63 14.521C200.463 14.3804 200.218 14.3127 199.895 14.3127ZM198.656 12.797C199.098 12.4585 199.562 12.1981 200.046 12.0054C200.525 11.8127 201.031 11.7189 201.562 11.7189C202.307 11.7189 202.885 11.87 203.312 12.172C203.734 12.4741 204.031 12.87 204.197 13.3595C204.364 13.8491 204.437 14.3908 204.406 14.9897C204.374 15.5939 204.281 16.1877 204.13 16.7814C203.979 17.3647 203.76 17.9533 203.473 18.5522C203.182 19.1512 202.817 19.6981 202.38 20.1825C201.942 20.672 201.437 21.0731 200.864 21.3908C200.291 21.7033 199.64 21.8647 198.921 21.8647C198.442 21.8647 198.015 21.7866 197.64 21.6304C197.265 21.4741 196.937 21.2554 196.645 20.9741L195.916 23.8075C195.838 24.1043 195.702 24.3647 195.52 24.5887C195.338 24.8127 195.119 25.0002 194.874 25.1512C194.63 25.3075 194.369 25.4272 194.093 25.5054C193.817 25.5887 193.562 25.6252 193.317 25.6252H192.077L195.656 11.9064H198.864L198.656 12.797ZM210.442 14.0939C209.911 14.0939 209.51 14.2293 209.234 14.5002C208.952 14.771 208.718 15.1512 208.531 15.6304H211.395C211.484 15.1772 211.468 14.8022 211.348 14.521C211.223 14.2345 210.921 14.0939 210.442 14.0939ZM213.921 17.7814H207.979C207.958 18.0939 207.984 18.3439 208.057 18.5418C208.135 18.7397 208.26 18.896 208.432 19.0054C208.604 19.12 208.817 19.1929 209.077 19.2397C209.343 19.2814 209.64 19.3022 209.979 19.3022C210.395 19.3022 210.864 19.2502 211.374 19.146C211.885 19.0418 212.447 18.9012 213.062 18.7293L212.807 19.7293C212.692 20.1877 212.484 20.547 212.192 20.8127C211.895 21.0783 211.557 21.2814 211.182 21.4168C210.807 21.5522 210.416 21.6408 210.01 21.6772C209.609 21.7137 209.239 21.7345 208.9 21.7345C207.255 21.7345 206.067 21.3179 205.333 20.4897C204.604 19.6616 204.452 18.4064 204.885 16.7241C205.083 15.9585 205.364 15.2658 205.718 14.646C206.077 14.0314 206.51 13.5054 207.02 13.0731C207.531 12.6408 208.119 12.3075 208.786 12.0731C209.452 11.8335 210.192 11.7189 211.01 11.7189C211.838 11.7189 212.51 11.8335 213.025 12.0731C213.546 12.3075 213.932 12.6408 214.187 13.0731C214.447 13.5054 214.577 14.0262 214.588 14.6408C214.598 15.2502 214.505 15.9325 214.307 16.6877C214.239 16.9585 214.109 17.3231 213.921 17.7814ZM219.661 13.2241C220.208 12.7814 220.817 12.4377 221.494 12.2033C222.161 11.9689 222.864 11.8387 223.598 11.8179L222.906 14.4845C221.843 14.5106 220.937 14.7658 220.176 15.245C219.411 15.7293 218.906 16.4429 218.661 17.396L217.562 21.6043H214.124L216.619 12.0002H218.416C218.588 12.0002 218.749 12.0262 218.916 12.0731C219.083 12.1252 219.223 12.2033 219.348 12.3075C219.473 12.4116 219.567 12.5418 219.63 12.6981C219.687 12.8491 219.702 13.0262 219.661 13.2241ZM238.661 14.3127C238.468 14.3127 238.27 14.3543 238.067 14.4272C237.864 14.5002 237.671 14.5991 237.489 14.7241C237.307 14.8491 237.145 14.9897 237.01 15.1512C236.869 15.3075 236.775 15.4845 236.729 15.6668L236.156 17.8908C236.104 18.0783 236.104 18.2554 236.15 18.422C236.197 18.5887 236.281 18.7345 236.4 18.8595C236.515 18.9793 236.661 19.0783 236.827 19.1564C236.994 19.2293 237.176 19.2658 237.369 19.2658C237.682 19.2658 237.958 19.1929 238.197 19.0418C238.432 18.896 238.645 18.7033 238.822 18.4689C238.999 18.2345 239.15 17.9689 239.275 17.672C239.4 17.3752 239.499 17.0783 239.583 16.7814C239.666 16.4741 239.723 16.1668 239.755 15.87C239.791 15.5783 239.781 15.3075 239.723 15.0731C239.666 14.8387 239.557 14.6564 239.395 14.521C239.229 14.3804 238.984 14.3127 238.661 14.3127ZM237.421 12.797C237.864 12.4585 238.327 12.1981 238.812 12.0054C239.291 11.8127 239.796 11.7189 240.327 11.7189C241.067 11.7189 241.65 11.87 242.072 12.172C242.499 12.4741 242.791 12.87 242.963 13.3595C243.13 13.8491 243.202 14.3908 243.166 14.9897C243.14 15.5939 243.046 16.1877 242.895 16.7814C242.744 17.3647 242.525 17.9533 242.239 18.5522C241.947 19.1512 241.583 19.6981 241.145 20.1825C240.708 20.672 240.202 21.0731 239.63 21.3908C239.051 21.7033 238.406 21.8647 237.687 21.8647C237.208 21.8647 236.781 21.7866 236.406 21.6304C236.031 21.4741 235.702 21.2554 235.411 20.9741L234.682 23.8075C234.604 24.1043 234.468 24.3647 234.286 24.5887C234.098 24.8127 233.885 25.0002 233.64 25.1512C233.395 25.3075 233.135 25.4272 232.859 25.5054C232.583 25.5887 232.322 25.6252 232.083 25.6252H230.843L234.421 11.9064H237.63L237.421 12.797ZM249.317 14.2085C248.968 14.2085 248.676 14.2814 248.437 14.4325C248.197 14.5783 247.989 14.771 247.817 15.0158C247.645 15.2554 247.499 15.5262 247.38 15.8283C247.265 16.1356 247.161 16.4429 247.077 16.7658C246.994 17.0887 246.932 17.4012 246.895 17.7137C246.854 18.021 246.854 18.297 246.895 18.5366C246.942 18.7762 247.046 18.9741 247.213 19.12C247.385 19.271 247.64 19.3439 247.973 19.3439C248.312 19.3439 248.598 19.271 248.843 19.12C249.088 18.9741 249.296 18.7762 249.473 18.5366C249.645 18.297 249.786 18.021 249.9 17.7137C250.015 17.4012 250.109 17.0887 250.197 16.7658C250.275 16.4429 250.343 16.1356 250.39 15.8283C250.432 15.5262 250.437 15.2554 250.39 15.0158C250.348 14.771 250.244 14.5783 250.072 14.4325C249.906 14.2814 249.65 14.2085 249.317 14.2085ZM247.327 21.7918C246.525 21.7918 245.843 21.672 245.291 21.4377C244.739 21.2033 244.312 20.87 244.005 20.4377C243.702 20.0054 243.52 19.4793 243.473 18.8543C243.421 18.2293 243.494 17.5314 243.692 16.7658C243.89 16.0002 244.182 15.3075 244.557 14.6929C244.932 14.0731 245.38 13.547 245.911 13.1147C246.442 12.6825 247.041 12.3491 247.718 12.1095C248.395 11.8752 249.14 11.7606 249.942 11.7606C250.749 11.7606 251.426 11.8752 251.979 12.1095C252.531 12.3491 252.963 12.6825 253.265 13.1147C253.572 13.547 253.749 14.0731 253.801 14.6929C253.854 15.3075 253.781 16.0002 253.583 16.7658C253.38 17.5314 253.093 18.2293 252.718 18.8543C252.343 19.4793 251.89 20.0054 251.364 20.4377C250.833 20.87 250.229 21.2033 249.551 21.4377C248.874 21.672 248.135 21.7918 247.327 21.7918ZM258.942 13.1668C259.489 12.7189 260.098 12.3804 260.77 12.146C261.442 11.9116 262.145 11.7814 262.88 11.7554L262.182 14.4272C261.124 14.4481 260.213 14.7033 259.458 15.1877C258.692 15.6668 258.187 16.3856 257.942 17.3387L256.843 21.547H253.406L255.9 11.9429H257.697C257.869 11.9429 258.031 11.9637 258.197 12.0158C258.364 12.0627 258.505 12.1408 258.63 12.245C258.755 12.3543 258.848 12.4845 258.911 12.6356C258.968 12.7918 258.984 12.9689 258.942 13.1668ZM263.551 11.896L264.348 8.8335H266.166C266.577 8.8335 266.906 8.9585 267.161 9.20329C267.411 9.45329 267.489 9.77621 267.385 10.172L266.937 11.896H269.354L269.031 13.0627C268.984 13.245 268.9 13.4168 268.781 13.5731C268.661 13.7293 268.52 13.8647 268.354 13.9793C268.192 14.0991 268.01 14.1877 267.812 14.2606C267.614 14.3283 267.421 14.3595 267.229 14.3595H266.291L265.4 17.7345C265.301 18.12 265.239 18.4168 265.218 18.6252C265.197 18.8335 265.202 18.9793 265.234 19.0522C265.255 19.1043 265.317 19.146 265.411 19.1929C265.515 19.2345 265.682 19.2554 265.921 19.2554C266.197 19.2554 266.479 19.2293 266.765 19.1825C267.051 19.1304 267.406 19.047 267.838 18.922L267.14 21.5731C266.666 21.672 266.218 21.745 265.801 21.7866C265.385 21.8283 264.963 21.8543 264.531 21.8543C263.906 21.8543 263.38 21.7866 262.952 21.6512C262.52 21.5106 262.202 21.297 261.999 21.0002C261.791 20.7137 261.687 20.3231 261.687 19.8231C261.687 19.3231 261.775 18.7241 261.958 18.0314L262.906 14.3595L263.551 11.896Z" fill="white"/>
</svg>`;

  const emptyTeam = (side) => ({
    side,
    name: "",
    players: POSITIONS.map((position, index) => ({
      slotId: `${side}-${position}-${index}`,
      position,
      name: "",
      rating: null,
      attributes: [],
      known: false
    }))
  });

  const state = {
    screen: "home",
    home: emptyTeam("home"),
    away: emptyTeam("away"),
    match: null,
    activeField: null,
    query: "",
    paused: false,
    matchEntered: false,
    elapsedMs: 0,
    startedAt: null,
    timer: null,
    tick: null,
    loadingTick: null,
    transitionTick: null,
    loadingStep: 0,
    shareImage: ""
  };

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[char]));
  }

  function normalize(value = "") {
    return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "");
  }

  function scoreMatch(query, player, position) {
    const q = normalize(query);
    const name = normalize(player.name);
    const words = name.split(" ");
    let score = 0;
    if (name === q) score += 100;
    if (name.startsWith(q)) score += 55;
    if (name.includes(q)) score += 35;
    if (words.some((word) => word.startsWith(q))) score += 25;
    const chars = q.split("");
    let cursor = 0;
    chars.forEach((char) => {
      const found = name.indexOf(char, cursor);
      if (found >= 0) { score += 2; cursor = found + 1; }
    });
    if (player.positions.includes(position)) score += 18;
    return score;
  }

  function findPlayer(name) {
    const target = normalize(name);
    return PLAYERS.find((player) => normalize(player.name) === target);
  }

  function getSuggestions(query, position) {
    if (!query.trim()) return PLAYERS
      .filter((player) => player.positions.includes(position))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    return PLAYERS
      .map((player) => ({ ...player, searchScore: scoreMatch(query, player, position) }))
      .filter((player) => player.searchScore > 4)
      .sort((a, b) => b.searchScore - a.searchScore || b.rating - a.rating)
      .slice(0, 6);
  }

  function firstName(name) {
    return name.split(" ")[0] || name;
  }

  function lastName(name) {
    const parts = name.trim().split(" ");
    return parts[parts.length - 1] || name;
  }

  function teamBySide(side) {
    return side === "home" ? state.home : state.away;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ home: state.home, away: state.away }));
    } catch {}
  }

  function restoreState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.home?.players?.length === 5 && saved?.away?.players?.length === 5) {
        state.home = saved.home;
        state.away = saved.away;
      }
    } catch {}
  }

  function toast(message) {
    const region = document.querySelector("#toast-region");
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    region.appendChild(item);
    setTimeout(() => item.remove(), 2600);
  }

  function render() {
    clearTimers();
    if (state.screen === "home") renderHome();
    if (state.screen === "builder") renderBuilder();
    if (state.screen === "loading") renderLoading();
    if (state.screen === "match") renderMatch();
    if (state.screen === "fast-forward") renderFastForward();
    if (state.screen === "result-reveal") renderResultReveal();
    if (state.screen === "summary") renderSummary();
    bindGlobalEvents();
  }

  function renderHome() {
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen screen--enter home-screen" aria-labelledby="home-title">
          <div class="home-inner">
            <h1 class="brand" id="home-title">${LOGO_SVG}</h1>
            <p class="home-copy">Build a five-a-side lineup, choose an opponent, and watch a simulated fixture unfold with live play-by-play drama.</p>
            <button class="button button--wide" data-action="new-game">New Game</button>
          </div>
        </section>
      </main>`;
  }

  function renderBuilder(animate = false) {
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen builder-screen ${animate ? "screen--enter" : ""}" aria-labelledby="builder-title">
          <div class="topline">
            <button class="text-button" data-action="home" aria-label="Return to home">← Home</button>
            <h1 class="brand brand--small" id="builder-title">${LOGO_SVG}</h1>
            <span aria-hidden="true" style="width:64px"></span>
          </div>
          <div class="builder-grid">
            ${teamPanel(state.home)}
            ${pitchMarkup()}
            ${teamPanel(state.away)}
          </div>
          <div class="builder-footer">
            <button class="button button--wide" data-action="start-match" ${isReady() ? "" : "disabled"}>Start Match</button>
            <p class="builder-status">${builderStatus()}</p>
          </div>
        </section>
      </main>`;
    requestAnimationFrame(() => {
      if (state.activeField) {
        const input = document.querySelector(`[data-slot="${state.activeField}"]`);
        input?.focus();
        if (input) input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }

  function teamPanel(team) {
    return `
      <section class="team-panel team-panel--${team.side}" aria-label="${team.side} team">
        <p class="eyebrow team-kicker ${team.side}">${team.side}</p>
        <input class="team-name-input" data-team-name="${team.side}" maxlength="28" aria-label="${team.side} team name" placeholder="Enter Team Name" value="${escapeHtml(team.name)}" />
        <div class="player-fields">
          ${team.players.map((slot) => playerField(team, slot)).join("")}
        </div>
        <div class="team-actions">
          <button class="button button--ghost button--small" data-action="randomise" data-side="${team.side}">Randomise</button>
          <button class="button button--ghost button--small" data-action="clear-team" data-side="${team.side}">Clear</button>
        </div>
      </section>`;
  }

  function playerField(team, slot) {
    const isActive = state.activeField === slot.slotId;
    const suggestions = isActive ? getSuggestions(state.query, slot.position) : [];
    const isExact = findPlayer(state.query);
    return `
      <div class="player-field">
        <div class="player-input-wrap ${isActive ? "is-active" : ""}">
          <span class="position-tag">${slot.position}</span>
          <input class="player-input" data-slot="${slot.slotId}" data-side="${team.side}" aria-label="${team.side} ${slot.position} player" autocomplete="off" placeholder="Search a player..." value="${escapeHtml(isActive ? state.query : slot.name)}" />
          ${slot.name ? `<span class="selected-rating" title="${slot.known ? slot.attributes.join(", ") : "Custom player"}">${slot.rating}</span>` : ""}
        </div>
        ${isActive ? `
          <div class="suggestions" role="listbox">
            ${suggestions.map((player) => `
              <button class="suggestion" role="option" data-action="select-player" data-name="${escapeHtml(player.name)}">
                <span class="suggestion-line"><span>${escapeHtml(player.name)}</span><span>${player.rating}</span></span>
                <span class="suggestion-meta">${escapeHtml(player.era)} · ${escapeHtml(player.attributes.slice(0, 2).join(" · "))}</span>
              </button>`).join("")}
            ${state.query.trim() && !isExact ? `
              <button class="suggestion custom-option" role="option" data-action="select-custom">
                <span class="suggestion-line"><span>Use "${escapeHtml(state.query.trim())}"</span><span>65</span></span>
                <span class="suggestion-meta">Custom player · default rating</span>
              </button>` : ""}
          </div>` : ""}
      </div>`;
  }

  function pitchMarkup() {
    const positions = {
      home: [[43,50],[33,32],[33,68],[21,50],[10,50]],
      away: [[57,50],[67,32],[67,68],[79,50],[90,50]]
    };
    const players = ["home", "away"].flatMap((side) =>
      teamBySide(side).players.map((player, index) => ({ ...player, side, coords: positions[side][index] }))
    );
    return `
      <div class="pitch-wrap">
        <div class="pitch" aria-label="Five-a-side pitch preview">
          <div class="penalty left"></div><div class="penalty right"></div>
          ${players.map((player) => `
            <button
              class="pitch-player ${player.side} ${player.name ? "is-selected" : "is-empty"} ${state.activeField === player.slotId ? "is-active" : ""}"
              style="left:${player.coords[0]}%;top:${player.coords[1]}%"
              data-action="focus-slot"
              data-slot="${player.slotId}"
              aria-label="${player.name ? `Edit ${escapeHtml(player.name)}` : `Select ${player.side} ${player.position}`}"
            >
              <span class="pitch-dot">${player.position}</span>
              <span class="pitch-label">${escapeHtml(player.name ? lastName(player.name) : "Select")}</span>
            </button>`).join("")}
        </div>
        <p class="pitch-helper">Players appear on the pitch as you build each five.</p>
      </div>`;
  }

  function builderStatus() {
    const missingNames = [state.home, state.away].filter((team) => !team.name.trim()).length;
    const missingPlayers = [...state.home.players, ...state.away.players].filter((player) => !player.name.trim()).length;
    if (!missingNames && !missingPlayers) return "Both squads are ready. Let's play.";
    const parts = [];
    if (missingNames) parts.push(`${missingNames} team name${missingNames > 1 ? "s" : ""}`);
    if (missingPlayers) parts.push(`${missingPlayers} player${missingPlayers > 1 ? "s" : ""}`);
    return `Add ${parts.join(" and ")} to start the match.`;
  }

  function isReady() {
    return state.home.name.trim() && state.away.name.trim() &&
      [...state.home.players, ...state.away.players].every((player) => player.name.trim());
  }

  function selectPlayer(name, custom = false) {
    const slot = [...state.home.players, ...state.away.players].find((player) => player.slotId === state.activeField);
    if (!slot) return;
    const team = teamBySide(slot.slotId.startsWith("home") ? "home" : "away");
    const allSlots = [...state.home.players, ...state.away.players];
    if (allSlots.some((player) => player.slotId !== slot.slotId && player.name && normalize(player.name) === normalize(name))) {
      toast(`${name} is already picked for this match.`);
      return;
    }
    const known = custom ? null : findPlayer(name);
    slot.name = known?.name || name.trim();
    slot.rating = known?.rating || 65;
    slot.attributes = known?.attributes || ["determination", "teamwork"];
    slot.known = Boolean(known);
    state.activeField = null;
    state.query = "";
    saveState();
    renderBuilder(false);
  }

  function updatePlayerDraft(slotId, value) {
    const slot = [...state.home.players, ...state.away.players].find((player) => player.slotId === slotId);
    if (!slot) return;
    const cleanName = value.trim();
    const known = findPlayer(cleanName);
    slot.name = cleanName;
    slot.rating = cleanName ? known?.rating || 65 : null;
    slot.attributes = cleanName ? known?.attributes || ["determination", "teamwork"] : [];
    slot.known = Boolean(known);
    saveState();
  }

  function randomiseTeam(side) {
    const team = teamBySide(side);
    const otherSide = side === "home" ? "away" : "home";
    const other = teamBySide(otherSide);
    const used = new Set(other.players.filter((player) => player.name).map((player) => normalize(player.name)));
    team.players.forEach((slot) => {
      const pool = PLAYERS.filter((player) => player.positions.includes(slot.position) && !used.has(normalize(player.name)));
      if (!pool.length) return;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      used.add(normalize(pick.name));
      Object.assign(slot, { name: pick.name, rating: pick.rating, attributes: pick.attributes, known: true });
    });
    if (!team.name.trim()) {
      const first = ["Banger", "Ballerz", "Touchline", "Top Bin", "Five Star", "Nutmeg", "Sunday"];
      const second = ["United", "FC", "Athletic", "Rovers", "City", "Collective"];
      team.name = `${first[Math.floor(Math.random() * first.length)]} ${second[Math.floor(Math.random() * second.length)]}`;
    }
    saveState();
    renderBuilder(false);
  }

  function clearTeam(side) {
    const team = teamBySide(side);
    const replacement = emptyTeam(side);
    team.name = "";
    team.players = replacement.players;
    saveState();
    renderBuilder(false);
  }

  function focusPlayerSlot(slotId) {
    const slot = [...state.home.players, ...state.away.players].find((player) => player.slotId === slotId);
    if (!slot) return;
    state.activeField = slotId;
    state.query = slot.name || "";
    renderBuilder(false);
  }

  function closePlayerSearch() {
    if (!state.activeField) return;
    state.activeField = null;
    state.query = "";
    document.querySelector(".suggestions")?.remove();
    document.querySelector(".player-input-wrap.is-active")?.classList.remove("is-active");
    document.querySelector(".pitch-player.is-active")?.classList.remove("is-active");
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(value) {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function weightedPick(items, weight, rand) {
    const total = items.reduce((sum, item) => sum + Math.max(1, weight(item)), 0);
    let cursor = rand() * total;
    for (const item of items) {
      cursor -= Math.max(1, weight(item));
      if (cursor <= 0) return item;
    }
    return items[items.length - 1];
  }

  function teamStrength(team) {
    const base = team.players.reduce((sum, player) => sum + player.rating, 0) / 5;
    const balance = Math.min(...POSITIONS.map((position) =>
      team.players.filter((player) => player.position === position).length || 1
    ));
    return base + balance;
  }

  function chanceTeam(home, away, rand) {
    const homeWeight = teamStrength(home) + 2.2;
    const awayWeight = teamStrength(away);
    return rand() < homeWeight / (homeWeight + awayWeight) ? home : away;
  }

  function attackingPlayer(team, rand) {
    return weightedPick(team.players, (player) =>
      player.position === "GK" ? 2 :
        player.rating + (player.position === "ST" ? 28 : player.position === "MID" ? 16 : 3), rand);
  }

  function assistingPlayer(team, scorer, rand) {
    const outfield = team.players.filter((player) => player.slotId !== scorer.slotId && player.position !== "GK");
    return weightedPick(outfield.length ? outfield : team.players.filter((player) => player.slotId !== scorer.slotId), (player) =>
      player.rating + (player.position === "MID" ? 22 : player.position === "DEF" ? 8 : 0), rand);
  }

  function goalkeeper(team) {
    return team.players.find((player) => player.position === "GK") || team.players[4];
  }

  function commentaryReadingTime(event) {
    const wordCount = `${event.heading} ${event.text}`.trim().split(/\s+/).filter(Boolean).length;
    const readingMs = (wordCount / COMMENTARY_WORDS_PER_MINUTE) * 60000;
    return Math.max(COMMENTARY_MIN_MS, Math.min(COMMENTARY_MAX_MS, readingMs + 1500));
  }

  function scheduleCommentaryEvents(events) {
    const halftimeIndex = events.findIndex((event) => event.type === "halftime");
    const fulltimeIndex = events.findIndex((event) => event.type === "fulltime");
    const firstHalf = events.slice(0, halftimeIndex);
    const secondHalf = events.slice(halftimeIndex + 1, fulltimeIndex);

    const scheduleHalf = (items, startMs, endMs) => {
      if (!items.length) return;
      const durations = items.map(commentaryReadingTime);
      const total = durations.reduce((sum, duration) => sum + duration, 0);
      const scale = total ? (endMs - startMs) / total : 0;
      let cursor = startMs;
      items.forEach((event, index) => {
        event.atMs = Math.round(cursor);
        event.readingMs = durations[index];
        event.displayMs = Math.round(durations[index] * scale);
        const isSecondHalf = startMs >= MATCH_DURATION_MS / 2;
        const halfProgress = (event.atMs - startMs) / (endMs - startMs);
        event.displayMinute = isSecondHalf
          ? Math.min(29, Math.max(16, Math.round(15 + halfProgress * 15)))
          : Math.min(14, Math.max(0, Math.round(halfProgress * 15)));
        cursor += event.displayMs;
      });
    };

    scheduleHalf(firstHalf, 0, 71500);
    if (halftimeIndex >= 0) {
      events[halftimeIndex].atMs = 75000;
      events[halftimeIndex].displayMs = 5000;
      events[halftimeIndex].displayMinute = 15;
    }
    scheduleHalf(secondHalf, 79500, 146500);
    if (fulltimeIndex >= 0) {
      events[fulltimeIndex].atMs = MATCH_DURATION_MS;
      events[fulltimeIndex].displayMs = 0;
      events[fulltimeIndex].displayMinute = 30;
    }
  }

  function generateMatch() {
    const snapshot = JSON.stringify([state.home, state.away, Date.now()]);
    const seed = hash(snapshot);
    const rand = seeded(seed);
    const events = [];
    const contributions = {};
    const score = { home: 0, away: 0 };
    const key = (side, slotId) => `${side}:${slotId}`;
    const addContribution = (side, player, type) => {
      const id = key(side, player.slotId);
      contributions[id] ||= { goals: 0, assists: 0, saves: 0 };
      contributions[id][type] += 1;
    };
    const createEvent = (minute, type, team, player, other, goal = false) => {
      const opponent = team.side === "home" ? state.away : state.home;
      const attribute = player.attributes[Math.floor(rand() * player.attributes.length)] || "quality";
      const templates = {
        kickoff: `The whistle goes. ${state.home.name} get this five-a-side contest moving against ${state.away.name}.`,
        chance: `${player.name} uses that ${attribute} to make half a yard, but the finish whistles just past the post.`,
        save: `${player.name} lets fly after a sharp exchange with ${other.name}, but ${goalkeeper(opponent).name} reacts brilliantly to keep it out.`,
        block: `${player.name} drives into space. ${other.name} reads it early and throws in a vital block.`,
        skill: `${player.name} brings the crowd alive with a flash of ${attribute}, gliding away from the first challenge.`,
        goal: `${other.name} spots the run and slides a perfectly weighted pass into ${player.name}, whose ${attribute} does the rest. ${team.name} have their goal!`,
        soloGoal: `${player.name} takes responsibility, powers through with ${attribute}, and buries the finish. A sensational solo goal for ${team.name}!`,
        halftime: `Half-time. Both sides take a breath after a frantic opening 15 minutes.`,
        fulltime: `Full-time. The whistle ends a breathless five-a-side contest.`
      };
      const heading = type === "goal" || type === "soloGoal" ? "Goal!" :
        type === "save" ? "What a save!" : type === "halftime" ? "Half-time" :
        type === "fulltime" ? "Full-time" : type === "kickoff" ? "Kick-off" :
        type === "skill" ? "Silky stuff" : type === "block" ? "Big block" : "So close!";
      events.push({
        minute,
        displayMinute: Math.max(0, Math.ceil(minute)),
        atMs: Math.round((minute / 30) * MATCH_DURATION_MS), type, heading,
        side: team?.side || "neutral", text: templates[type], score: { ...score }, goal
      });
    };

    createEvent(0, "kickoff", state.home, state.home.players[0], state.home.players[1]);
    const goalExpectation = Math.max(2, Math.min(7,
      Math.round(2.2 + (teamStrength(state.home) + teamStrength(state.away) - 150) / 22 + rand() * 2)
    ));
    const goalMinutes = new Set();
    while (goalMinutes.size < goalExpectation) goalMinutes.add(3 + Math.floor(rand() * 25));
    const eventMinutes = new Set([
      ...goalMinutes,
      1.5, 3.5, 5.5, 7.5, 9.5, 11.5, 13.5, 15,
      16.5, 18.5, 20.5, 22.5, 24.5, 26.5, 28.5, 30
    ]);
    [...eventMinutes].sort((a, b) => a - b).forEach((minute) => {
      if (minute === 15) {
        createEvent(15, "halftime", state.home, state.home.players[0], state.away.players[0]);
        return;
      }
      if (minute === 30) {
        createEvent(30, "fulltime", state.home, state.home.players[0], state.away.players[0]);
        return;
      }
      const team = chanceTeam(state.home, state.away, rand);
      const opponent = team.side === "home" ? state.away : state.home;
      const attacker = attackingPlayer(team, rand);
      const assister = assistingPlayer(team, attacker, rand);
      if (goalMinutes.has(minute)) {
        const solo = rand() < .26;
        score[team.side] += 1;
        addContribution(team.side, attacker, "goals");
        if (!solo) addContribution(team.side, assister, "assists");
        createEvent(minute, solo ? "soloGoal" : "goal", team, attacker, assister, true);
      } else {
        const roll = rand();
        if (roll < .34) {
          addContribution(opponent.side, goalkeeper(opponent), "saves");
          createEvent(minute, "save", team, attacker, assister);
        } else if (roll < .58) {
          createEvent(minute, "chance", team, attacker, assister);
        } else if (roll < .78) {
          createEvent(minute, "skill", team, attacker, assister);
        } else {
          createEvent(minute, "block", team, attacker, weightedPick(opponent.players, (p) => p.position === "DEF" ? 130 : p.rating, rand));
        }
      }
    });

    events.sort((a, b) => a.minute - b.minute);
    scheduleCommentaryEvents(events);
    events.forEach((event) => {
      if (event.type === "fulltime") event.score = { ...score };
    });
    const winner = score.home === score.away ? null : score.home > score.away ? state.home : state.away;
    const loser = winner ? (winner.side === "home" ? state.away : state.home) : null;
    const allScorers = Object.entries(contributions)
      .filter(([, item]) => item.goals)
      .map(([id, item]) => {
        const [side, slotId] = id.split(":");
        const player = teamBySide(side).players.find((p) => p.slotId === slotId);
        return { player, side, ...item };
      })
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists);
    const top = allScorers[0];
    const headline = winner
      ? score[winner.side] - score[loser.side] >= 3 ? `${winner.name} run riot!` : `${winner.name} edge a five-a-side thriller!`
      : `${state.home.name} and ${state.away.name} can't be separated!`;
    const description = winner
      ? `${winner.name} claimed a ${score.home}–${score.away} win in a game packed with quick combinations and brave goalkeeping.${top ? ` ${top.player.name} led the scoring with ${top.goals} goal${top.goals > 1 ? "s" : ""}.` : ""} ${loser.name} kept pushing until the final whistle, but the decisive moments belonged to ${winner.name}.`
      : `A breathless ${score.home}–${score.away} draw delivered chances at both ends and no shortage of drama.${top ? ` ${top.player.name} was central to the action with ${top.goals} goal${top.goals > 1 ? "s" : ""}.` : ""} Neither side could find the winner before the final whistle.`;

    return { seed, events, contributions, finalScore: score, headline, description };
  }

  function startMatch() {
    if (!isReady()) return;
    state.match = generateMatch();
    state.elapsedMs = 0;
    state.paused = false;
    state.matchEntered = false;
    state.loadingStep = 0;
    state.screen = "loading";
    render();
  }

  function renderLoading() {
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen loading-screen screen--enter" aria-labelledby="loading-title">
          <div class="loading-inner">
            <h1 class="brand brand--small">${LOGO_SVG}</h1>
            <div class="loading-fixture" aria-label="${escapeHtml(state.home.name)} versus ${escapeHtml(state.away.name)}">
              <span>${escapeHtml(state.home.name)}</span>
              <strong>VS</strong>
              <span>${escapeHtml(state.away.name)}</span>
            </div>
            <div class="loading-ball" aria-hidden="true">⚽</div>
            <p class="loading-line" id="loading-title" aria-live="polite">${escapeHtml(LOADING_LINES[state.loadingStep])}</p>
            <div class="loading-dots" aria-hidden="true">
              ${LOADING_LINES.map((_, index) => `<span class="${index <= state.loadingStep ? "is-on" : ""}"></span>`).join("")}
            </div>
          </div>
        </section>
      </main>`;
    runLoadingSequence();
  }

  function runLoadingSequence() {
    if (state.loadingTick) clearInterval(state.loadingTick);
    state.loadingTick = setInterval(() => {
      state.loadingStep += 1;
      if (state.loadingStep >= LOADING_LINES.length) {
        clearInterval(state.loadingTick);
        state.loadingTick = null;
        state.elapsedMs = 0;
        state.startedAt = Date.now();
        state.screen = "match";
        render();
        return;
      }
      const line = document.querySelector(".loading-line");
      if (line) {
        line.classList.remove("is-changing");
        void line.offsetWidth;
        line.textContent = LOADING_LINES[state.loadingStep];
        line.classList.add("is-changing");
      }
      document.querySelectorAll(".loading-dots span").forEach((dot, index) => {
        dot.classList.toggle("is-on", index <= state.loadingStep);
      });
    }, LOADING_BEAT_MS);
  }

  function currentEvents() {
    return state.match.events.filter((event) => event.atMs <= state.elapsedMs);
  }

  function currentScore() {
    const goals = currentEvents().filter((event) => event.goal);
    return goals.reduce((score, event) => {
      score[event.side] += 1;
      return score;
    }, { home: 0, away: 0 });
  }

  function renderScoreBug(score, compact = false, showClock = false, statusText = "") {
    if (showClock) {
      const status = scoreBugStatus();
      return `
        <div class="live-score-stack">
          <div class="score-bug score-bug--live">
            <div class="score-team home">
              <p class="score-label">Home</p>
              <p class="score-name">${escapeHtml(state.home.name)}</p>
            </div>
            <div class="score-centre">
              <div class="scoreline">
                <span class="score-num" data-score-side="home">${score.home}</span>
                <span>–</span>
                <span class="score-num" data-score-side="away">${score.away}</span>
              </div>
            </div>
            <div class="score-team away">
              <p class="score-label">Away</p>
              <p class="score-name">${escapeHtml(state.away.name)}</p>
            </div>
          </div>
          <div class="score-status ${status.kind === "paused" ? "score-status--paused" : ""}">
            <time class="score-status-text" aria-label="Match status">${escapeHtml(status.text)}</time>
          </div>
        </div>`;
    }
    const scoreMarkup = `
      <div class="score-bug score-bug--final ${compact ? "compact" : ""}">
          <div class="score-team home">
            <p class="score-label">Home</p><p class="score-name">${escapeHtml(state.home.name)}</p>
          </div>
          <div class="score-centre">
            <div class="scoreline"><span class="score-num">${score.home}</span><span>–</span><span class="score-num">${score.away}</span></div>
          </div>
          <div class="score-team away">
            <p class="score-label">Away</p><p class="score-name">${escapeHtml(state.away.name)}</p>
          </div>
        </div>`;
    if (!statusText) return scoreMarkup;
    return `
      <div class="final-score-stack">
        ${scoreMarkup}
        <div class="score-status">
          <span class="score-status-text">${escapeHtml(statusText)}</span>
        </div>
      </div>`;
  }

  function renderMatch() {
    const events = currentEvents();
    const featured = events[events.length - 1] || state.match.events[0];
    const score = currentScore();
    const animate = !state.matchEntered;
    state.matchEntered = true;
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen ${animate ? "screen--enter" : ""} match-screen" aria-labelledby="match-title">
          <h1 class="brand brand--small" id="match-title">${LOGO_SVG}</h1>
          ${renderScoreBug(score, false, true)}
          <div class="match-controls">
            <button class="icon-button" data-action="pause">${state.paused ? "Play" : "Pause"}</button>
            <button class="icon-button" data-action="skip" aria-label="Skip to full-time">Skip</button>
          </div>
          <div class="commentary-stage" aria-live="polite">
            ${eventCard(featured, true)}
            <div class="commentary-history">
              ${events.slice(0, -1).reverse().slice(0, 4).map((event) => eventCard(event, false)).join("")}
            </div>
          </div>
        </section>
      </main>`;
    if (!state.paused) runClock();
  }

  function eventCard(event, featured) {
    const sideClass = event.goal ? `event-card--${event.side}` : "event-card--neutral";
    return `
      <article
        class="${featured ? "featured-event" : "history-card"} ${sideClass}"
        data-event="${event.minute}-${event.type}"
        data-dwell-ms="${event.displayMs || 0}"
        data-reading-ms="${event.readingMs || 0}"
      >
        <h2 class="${featured ? "event-heading" : "history-title"}">${event.displayMinute}' ${escapeHtml(event.heading)}</h2>
        <p class="${featured ? "event-copy" : "history-copy"}">${escapeHtml(event.text)}</p>
      </article>`;
  }

  function formatMatchClock(elapsed) {
    const halfDuration = MATCH_DURATION_MS / 2;
    const stoppageWindow = 5000;
    const regulationWindow = halfDuration - stoppageWindow;
    const inSecondHalf = elapsed >= halfDuration;
    const halfElapsed = inSecondHalf ? elapsed - halfDuration : elapsed;
    const baseSeconds = inSecondHalf ? 15 * 60 : 0;
    if (halfElapsed < regulationWindow) {
      const matchSeconds = baseSeconds + Math.floor((halfElapsed / regulationWindow) * 15 * 60);
      const minutes = Math.floor(matchSeconds / 60);
      const seconds = matchSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    const regulationMinute = inSecondHalf ? 30 : 15;
    const addedSeconds = Math.min(59, Math.floor(((halfElapsed - regulationWindow) / stoppageWindow) * 60));
    return `${regulationMinute}:00 +0:${String(addedSeconds).padStart(2, "0")}`;
  }

  function scoreBugStatus() {
    if (state.paused) return { kind: "paused", text: "Paused" };
    const halfDuration = MATCH_DURATION_MS / 2;
    if (state.elapsedMs >= halfDuration && state.elapsedMs < 79500) {
      return { kind: "half-time", text: "Half Time" };
    }
    return { kind: "live", text: formatMatchClock(state.elapsedMs) };
  }

  function updateScoreStatus() {
    const status = scoreBugStatus();
    const statusText = document.querySelector(".score-status-text");
    const statusTab = document.querySelector(".score-status");
    if (statusText) statusText.textContent = status.text;
    if (statusTab) statusTab.classList.toggle("score-status--paused", status.kind === "paused");
  }

  function runClock() {
    clearTimers();
    state.startedAt = Date.now() - state.elapsedMs;
    state.tick = setInterval(() => {
      const previousEventCount = currentEvents().length;
      state.elapsedMs = Math.min(MATCH_DURATION_MS, Date.now() - state.startedAt);
      const nextEventCount = currentEvents().length;
      if (state.elapsedMs >= MATCH_DURATION_MS) {
        finishMatch();
      } else if (nextEventCount !== previousEventCount) {
        renderMatch();
      } else {
        updateScoreStatus();
      }
    }, 100);
  }

  function clearTimers() {
    if (state.tick) clearInterval(state.tick);
    if (state.timer) clearTimeout(state.timer);
    if (state.loadingTick) clearInterval(state.loadingTick);
    if (state.transitionTick) clearInterval(state.transitionTick);
    state.tick = null;
    state.timer = null;
    state.loadingTick = null;
    state.transitionTick = null;
  }

  function togglePause() {
    if (state.paused) {
      state.paused = false;
      state.startedAt = Date.now() - state.elapsedMs;
      renderMatch();
    } else {
      state.elapsedMs = Math.min(MATCH_DURATION_MS, Date.now() - state.startedAt);
      state.paused = true;
      clearTimers();
      renderMatch();
    }
  }

  function finishMatch() {
    clearTimers();
    state.elapsedMs = MATCH_DURATION_MS;
    state.screen = "result-reveal";
    render();
  }

  function skipMatch() {
    clearTimers();
    state.screen = "fast-forward";
    render();
  }

  function renderFastForward() {
    const score = currentScore();
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen fast-forward-screen" aria-labelledby="fast-forward-title">
          <div class="fast-forward-match">
            ${renderScoreBug(score, false, true)}
            <div class="fast-forward-track"><span></span></div>
            <div class="fast-forward-ghosts" aria-hidden="true">
              ${[1,2,3,4,5].map(() => "<i>»</i>").join("")}
            </div>
            <h1 id="fast-forward-title">Racing to full-time</h1>
            <p>Compressing the drama. Keeping the goals.</p>
          </div>
        </section>
      </main>`;
    runFastForward();
  }

  function runFastForward() {
    const duration = 2200;
    const initialElapsed = state.elapsedMs;
    const started = Date.now();
    state.transitionTick = setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      state.elapsedMs = initialElapsed + (MATCH_DURATION_MS - initialElapsed) * eased;
      const score = currentScore();
      const homeScore = document.querySelector('[data-score-side="home"]');
      const awayScore = document.querySelector('[data-score-side="away"]');
      const track = document.querySelector(".fast-forward-track span");
      updateScoreStatus();
      if (homeScore) homeScore.textContent = score.home;
      if (awayScore) awayScore.textContent = score.away;
      if (track) track.style.width = `${progress * 100}%`;
      if (progress >= 1) {
        clearInterval(state.transitionTick);
        state.transitionTick = null;
        state.elapsedMs = MATCH_DURATION_MS;
        state.screen = "result-reveal";
        render();
      }
    }, 50);
  }

  function revealResult() {
    const score = state.match.finalScore;
    if (score.home === score.away) {
      return { title: "Honours Even!" };
    }
    const winner = score.home > score.away ? state.home : state.away;
    return { title: `${winner.name} Win!` };
  }

  function renderResultReveal() {
    const result = revealResult();
    const score = state.match.finalScore;
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen result-reveal-screen screen--enter" aria-labelledby="result-reveal-title">
          <div class="result-reveal-inner">
            <div class="winner-score-bug">${renderScoreBug(score, true)}</div>
            <h1 id="result-reveal-title">${escapeHtml(result.title)}</h1>
          </div>
        </section>
      </main>`;
    state.timer = setTimeout(() => {
      state.timer = null;
      state.screen = "summary";
      render();
    }, WINNER_REVEAL_MS);
  }

  function contributionsFor(side, player) {
    return state.match.contributions[`${side}:${player.slotId}`] || { goals: 0, assists: 0, saves: 0 };
  }

  function lineupMarkup(team) {
    return `
      <div class="lineup ${team.side}">
        ${team.players.map((player) => {
          const item = contributionsFor(team.side, player);
          return `
            <div class="lineup-player">
              <span class="lineup-position">${player.position}</span>
              <span class="lineup-name">${escapeHtml(player.name)}</span>
              <span class="contributions" aria-label="${item.goals} goals, ${item.assists} assists, ${item.saves} saves">${"⚽".repeat(item.goals)}${"🎯".repeat(item.assists)}${item.saves ? ` 🧤${item.saves}` : ""}</span>
            </div>`;
        }).join("")}
      </div>`;
  }

  function renderSummary() {
    const score = state.match.finalScore;
    app.innerHTML = `
      <main class="app-shell">
        <section class="screen screen--enter summary-screen" aria-labelledby="summary-title">
          <h1 class="brand brand--small">${LOGO_SVG}</h1>
          <div class="summary-wrap">
            <h2 class="summary-headline" id="summary-title">${escapeHtml(state.match.headline)}</h2>
            <p class="summary-copy">${escapeHtml(state.match.description)}</p>
            <div class="summary-card">
              ${renderScoreBug(score, true, false, "Full Time")}
              <div class="lineups">${lineupMarkup(state.home)}${lineupMarkup(state.away)}</div>
            </div>
            <div class="summary-actions">
              <button class="button" data-action="share">Share Match Results</button>
              <button class="button button--ghost" data-action="play-again">Play Again</button>
            </div>
          </div>
        </section>
      </main>`;
  }

  function loadLogoImage() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "logo.svg";
    });
  }

  async function buildShareImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    const score = state.match.finalScore;
    ctx.fillStyle = "#111fa3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(0, 900, 0, 0, 900, 850);
    gradient.addColorStop(0, "rgba(241,199,47,.22)");
    gradient.addColorStop(1, "rgba(241,199,47,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
      const logo = await loadLogoImage();
      const logoWidth = 320;
      const logoHeight = logoWidth * (logo.height / logo.width);
      ctx.drawImage(logo, 600 - logoWidth / 2, 40, logoWidth, logoHeight);
    } catch {
      ctx.fillStyle = "#ececf8";
      ctx.font = "92px Anton, Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SQUAD UP", 600, 106);
    }

    ctx.fillStyle = "#ececf8";
    ctx.font = "700 30px Inter, Arial";
    ctx.textAlign = "center";
    wrapCanvasText(ctx, state.match.headline, 600, 165, 960, 38);
    roundedRect(ctx, 145, 205, 910, 120, 20, "#ececf8");
    ctx.fillStyle = "#db1b13";
    ctx.font = "800 16px Inter, Arial";
    ctx.textAlign = "left";
    ctx.fillText("HOME", 185, 244);
    ctx.fillStyle = "#111fa3";
    ctx.font = "800 25px Inter, Arial";
    fitCanvasText(ctx, state.home.name, 185, 282, 285, 25);
    ctx.fillStyle = "#b68b00";
    ctx.font = "800 16px Inter, Arial";
    ctx.textAlign = "right";
    ctx.fillText("AWAY", 1015, 244);
    ctx.fillStyle = "#111fa3";
    ctx.font = "800 25px Inter, Arial";
    fitCanvasText(ctx, state.away.name, 1015, 282, 285, 25, "right");
    ctx.textAlign = "center";
    ctx.font = "800 64px Inter, Arial";
    ctx.fillText(`${score.home} – ${score.away}`, 600, 287);

    drawShareLineup(ctx, state.home, 145, 365, 430);
    drawShareLineup(ctx, state.away, 625, 365, 430);

    ctx.fillStyle = "rgba(236,236,248,.78)";
    ctx.font = "500 18px Inter, Arial";
    ctx.textAlign = "center";
    wrapCanvasText(ctx, state.match.description, 600, 745, 900, 27, 3);
    ctx.fillStyle = "#f1c72f";
    ctx.font = "800 18px Inter, Arial";
    ctx.textAlign = "center";
    ctx.fillText("THINK YOUR FIVE CAN BEAT THIS? BUILD YOURS ON SQUAD UP.", 600, 855);
    return canvas.toDataURL("image/png");
  }

  function drawShareLineup(ctx, team, x, y, width) {
    team.players.forEach((player, index) => {
      const item = contributionsFor(team.side, player);
      const rowY = y + index * 62;
      roundedRect(ctx, x, rowY, width, 48, 24, "rgba(236,236,248,.09)");
      ctx.textAlign = "left";
      ctx.fillStyle = team.side === "home" ? "#f08a86" : "#f1c72f";
      ctx.font = "800 13px Inter, Arial";
      ctx.fillText(player.position, x + 18, rowY + 30);
      ctx.fillStyle = "#ececf8";
      ctx.font = "600 17px Inter, Arial";
      fitCanvasText(ctx, player.name, x + 64, rowY + 31, width - 155, 17);
      const marks = `${"⚽".repeat(item.goals)}${"🎯".repeat(item.assists)}${item.saves ? `🧤${item.saves > 1 ? item.saves : ""}` : ""}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "#ececf8";
      ctx.font = "16px Inter, Arial";
      ctx.fillText(marks, x + width - 18, rowY + 30);
    });
  }

  function fitCanvasText(ctx, text, x, y, maxWidth, startSize, align = "left") {
    let size = startSize;
    ctx.textAlign = align;
    while (size > 12 && ctx.measureText(text).width > maxWidth) {
      size -= 1;
      ctx.font = ctx.font.replace(/\d+px/, `${size}px`);
    }
    ctx.fillText(text, x, y);
  }

  function roundedRect(ctx, x, y, width, height, radius, fill) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = `${line}${word} `;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line.trim());
        line = `${word} `;
      } else line = test;
    });
    if (line && lines.length < maxLines) lines.push(line.trim());
    lines.slice(0, maxLines).forEach((item, index) => ctx.fillText(item, x, y + index * lineHeight));
  }

  async function openShareModal() {
    state.shareImage = await buildShareImage();
    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.dataset.modal = "share";
    modal.innerHTML = `
      <section class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <div class="modal-top">
          <h2 class="modal-title" id="share-title">Share the result</h2>
          <button class="close-button" data-action="close-share" aria-label="Close share dialog">×</button>
        </div>
        <img class="share-preview" src="${state.shareImage}" alt="Share card showing ${escapeHtml(state.home.name)} ${state.match.finalScore.home}, ${escapeHtml(state.away.name)} ${state.match.finalScore.away}" />
        <div class="share-actions">
          <button class="button" data-action="native-share">Share result</button>
          <button class="button button--ghost" data-action="download-share">Download</button>
          <button class="button button--ghost" data-action="copy-result">Copy caption</button>
        </div>
        <p class="share-note">"Share result" sends the match card and a ready-made challenge caption through your standard share sheet.</p>
      </section>`;
    document.body.appendChild(modal);
    modal.querySelector(".close-button").focus();
  }

  function resultCaption() {
    return `${state.home.name} ${state.match.finalScore.home}–${state.match.finalScore.away} ${state.away.name}\n\n${state.match.headline}\n\nThink your five can beat this? Build your squad, run the match and share the result on Squad Up. #SquadUp #FiveASide`;
  }

  async function nativeShare() {
    if (!state.shareImage) return;
    const blob = await (await fetch(state.shareImage)).blob();
    const file = new File([blob], "squad-up-result.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ title: "Squad Up result", text: resultCaption(), files: [file] }); } catch {}
    } else {
      downloadShare();
      toast("Sharing isn't supported here, so the image was downloaded.");
    }
  }

  function downloadShare() {
    if (!state.shareImage) return;
    const link = document.createElement("a");
    link.href = state.shareImage;
    link.download = "squad-up-result.png";
    link.click();
  }

  function closeShare() {
    document.querySelector('[data-modal="share"]')?.remove();
  }

  function bindGlobalEvents() {
    app.onclick = (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      if (action === "new-game") { state.screen = "builder"; renderBuilder(true); bindGlobalEvents(); }
      if (action === "home") { state.screen = "home"; render(); }
      if (action === "randomise") randomiseTeam(target.dataset.side);
      if (action === "clear-team") clearTeam(target.dataset.side);
      if (action === "focus-slot") focusPlayerSlot(target.dataset.slot);
      if (action === "select-player") selectPlayer(target.dataset.name);
      if (action === "select-custom") selectPlayer(state.query, true);
      if (action === "start-match") startMatch();
      if (action === "pause") togglePause();
      if (action === "skip") skipMatch();
      if (action === "share") openShareModal();
      if (action === "play-again") { state.match = null; state.screen = "builder"; renderBuilder(true); bindGlobalEvents(); }
    };

    app.oninput = (event) => {
      if (event.target.matches("[data-team-name]")) {
        teamBySide(event.target.dataset.teamName).name = event.target.value;
        saveState();
        const button = document.querySelector('[data-action="start-match"]');
        if (button) button.disabled = !isReady();
        const status = document.querySelector(".builder-status");
        if (status) status.textContent = builderStatus();
      }
      if (event.target.matches("[data-slot]")) {
        state.activeField = event.target.dataset.slot;
        state.query = event.target.value;
        updatePlayerDraft(state.activeField, state.query);
        renderBuilder(false);
      }
    };

    app.onfocusin = (event) => {
      if (event.target.matches("[data-slot]")) {
        if (state.activeField === event.target.dataset.slot) return;
        const slot = [...state.home.players, ...state.away.players].find((player) => player.slotId === event.target.dataset.slot);
        state.activeField = event.target.dataset.slot;
        state.query = slot?.name || "";
        renderBuilder(false);
      }
    };

    app.onkeydown = (event) => {
      if (event.key === "Escape" && state.activeField) {
        state.activeField = null;
        state.query = "";
        renderBuilder(false);
      }
      if (event.key === "Enter" && event.target.matches("[data-slot]") && state.query.trim()) {
        const exact = findPlayer(state.query);
        selectPlayer(exact?.name || state.query, !exact);
      }
    };

    document.onclick = async (event) => {
      const actionTarget = event.target.closest("[data-action]");
      if (
        state.screen === "builder" &&
        state.activeField &&
        !event.target.closest(".player-field") &&
        !event.target.closest('[data-action="focus-slot"]')
      ) {
        closePlayerSearch();
      }
      if (actionTarget?.dataset.action === "close-share" || event.target.matches(".modal-backdrop")) closeShare();
      if (actionTarget?.dataset.action === "download-share") downloadShare();
      if (actionTarget?.dataset.action === "native-share") nativeShare();
      if (actionTarget?.dataset.action === "copy-result") {
        try { await navigator.clipboard.writeText(resultCaption()); toast("Result caption copied."); } catch { toast(resultCaption()); }
      }
    };
  }

  restoreState();
  render();
})();
