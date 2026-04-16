import CategoryList from "../components/APIComponents"

export default function NewProduct() {

    
    return (
        <section className="prod-container">
            <header>
                <h1>Volver</h1>
            </header>
            <main>
                <form>
                    <label>Categoría: </label>
                    <CategoryList/>
                </form>
            </main>
        </section>
    )
}