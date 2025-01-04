import { useEffect, useState, useContext } from "react";
import { useNavigate,} from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const AllFoods = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // For navigation
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("https://fodis-server.vercel.app/allFood")
            .then((res) => res.json())
            .then((data) => {
                setFoods(data);
                setLoading(false);
            })
            .catch((err) => console.error("Failed to fetch food items:", err));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePurchaseClick = (foodId) => {
        if (!user) {
            navigate("/login"); // Redirect to login page if no user is logged in
        } else {
            navigate(`/details/${foodId}`); // Navigate to food details if user is logged in
        }
    };

    if (loading) {
        return <p className="text-center text-xl font-bold">Loading...</p>;
    }

    return (
        <>
            <div
                className="relative md:h-[380px] h-80 bg-cover object-cover bg-center flex items-center justify-start text-center gap-10 mb-10"
                style={{
                    backgroundImage: "url('https://i.ibb.co/ZmWGhZm/pexels-marcelochagas-3324435.jpg')",
                }}
            >
                <div className="bg-black bg-opacity-50 p-6 rounded-lg text-white">
                    <h1 className="text-3xl font-bold">Home | All Food</h1>
                </div>
            </div>

            <div className="bg-gray-100 p-8 text-black flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Foods</h1>

                {/* Search Bar with Button */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 text-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <button
                        onClick={() => setSearchTerm(searchTerm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="min-h-screen bg-gray-100 p-8 text-black">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredFoods.map((food) => {
                        const isOwner = user?.email === food.emailUser;
                        const isOutOfStock = food.stock === 0;

                        return (
                            <div
                                key={food._id}
                                className="p-6 bg-white shadow-lg rounded-lg flex flex-col justify-between"
                            >
                                <img
                                    src={food.image}
                                    alt={food.name}
                                    className="h-40 w-full object-cover rounded-lg mb-4"
                                />
                                <h2 className="text-xl font-bold">{food.name}</h2>
                                <p>Category: {food.category}</p>
                                <p>Price: ${food.price}</p>
                                <p>Available Stock: {food.stock}</p>
                                <p>Rating: {food.rating} ★</p>

                                {user && isOwner && (
                                    <p className="text-yellow-500 font-bold mt-4">
                                        You cannot purchase your own food item.
                                    </p>
                                )}

                                <div className="mt-4">
                                    <button
                                        onClick={() => handlePurchaseClick(food._id)}
                                        className={`btn ${
                                            isOutOfStock || (user && isOwner)
                                                ? "btn-disabled"
                                                : "btn-primary"
                                        }`}
                                        disabled={isOutOfStock || (user && isOwner)}
                                    >
                                        {isOutOfStock
                                            ? "Out of Stock"
                                            : user && isOwner
                                            ? "Your Item"
                                            : "Purchase"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default AllFoods;