import { Button } from "./ui/button";
import Card from '../components/Card'

export default function Dashboard() {
    return (
        <div className="flex-1 flex flex-col bg-gray-100">
            <Header />
            <Card />
        </div>
    );
}

const Header = () => {
    return (
        <header className="py-10 px-12 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">List Kelas</h1>
        </header>
    )
}
