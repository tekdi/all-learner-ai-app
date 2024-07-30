import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel2 from "../../assets/images/desktopLevel2.png";
import desktopLevel3 from "../../assets/images/desktopLevel3.jpg";
import {
  useSearchParams,
} from "../../../node_modules/react-router-dom/dist/index";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const images = {
    desktopLevel1,
    desktopLevel2,
    desktopLevel3,
  };
  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${
      images?.[`desktopLevel${searchParams.get("level") || 1}`]
    })`,
    backgroundSize: "contain", // Cover the entire viewport
    backgroundRepeat: "round", // Center the image
    position: "relative",
  };

  // let level = searchParams.get("level");
  // const navigate = useNavigate();
  //   useEffect(() => {
  //     if (level) {
  //       setTimeout(() => {
  //         navigate("/assesment");
  //       }, 2000);
  //     }
  //   }, [level]);

  return <div style={sectionStyle}></div>;
};

export default HomePage;
