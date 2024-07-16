/**
 * Componente Home
 * 
 * Este componente sirve como la página principal para la aplicación de gestión de videos. Utiliza el contexto
 * para obtener y manejar los datos de los videos, mostrando los videos en secciones categorizadas y una tarjeta de banner destacada.
 * También proporciona funcionalidad para editar y eliminar videos a través de modales.
 * 
 * Características:
 * - Muestra un estado de carga hasta que se obtienen los videos.
 * - Presenta una tarjeta de banner con el primer video de la lista o un video seleccionado.
 * - Categoriza y lista los videos basados en su categoría.
 * - Permite la edición y eliminación de videos a través de diálogos modales.
 * 
 * Estado:
 * - bannerCard: Contiene los datos del video que se mostrará en el banner.
 * - modalOpen: Booleano para controlar la visibilidad del modal para editar videos.
 * - currentCard: Contiene los datos del video actualmente seleccionado para editar.
 * - isLoading: Booleano para indicar si los videos aún se están obteniendo.
 * 
 * Hooks Utilizados:
 * - useState: Para manejar el estado del componente.
 * - useEffect: Para realizar efectos secundarios como obtener videos y actualizar la tarjeta del banner.
 * - useMemo: Para memorizar el objeto de búsqueda de categorías para optimización del rendimiento.
 * - useCallback: Para memorizar funciones de callback pasadas a componentes hijos.
 * 
 * Componentes:
 * - Banner: Muestra el video destacado.
 * - Category: Lista los videos por categoría.
 * - Modal: Un diálogo modal para editar los detalles del video.
 * - Loading: Un spinner de carga o mensaje mostrado mientras se obtienen los videos.
 * 
 * Contexto:
 * - useVideoContext: Proporciona acceso a los datos y operaciones de video como obtener, eliminar y actualizar videos.
 * 
 * Datos Externos:
 * - categoryData: Datos estáticos importados para categorizar los videos.
 * 
 * Funciones:
 * - useEffect: Establece la tarjeta de banner inicial y maneja el estado de carga basado en el arreglo de videos.
 * - categoryLookup: Crea un objeto de búsqueda para los nombres de categorías para acceso eficiente a los datos de categoría.
 * - handleCardClick: Establece un video como la tarjeta del banner y se desplaza a la sección del banner.
 * - handleCardDelete: Elimina un video y actualiza la tarjeta del banner si es necesario.
 * - handleCardEdit: Abre el modal para editar los detalles de un video.
 * - handleModalClose: Cierra el modal de edición de video.
 * - handleModalSave: Guarda los cambios en los detalles de un video y cierra el modal.
 * 
 * Uso:
 * Este componente está destinado a ser utilizado como la página de inicio de la aplicación de gestión de videos, proporcionando
 * una visión general completa y una interfaz de gestión para los videos.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import Banner from "../../components/banner/Banner";
import Category from "../../components/category/Category";
import Modal from "../../components/modal/Modal";
import categoryData from "../../data/CategoryData";
import { useVideoContext } from "../../contexts/VideoContext";
import Loading from "../../components/loading/Loading"; 

function Home() {
    const { videos, deleteVideo, updateVideo } = useVideoContext();
    const [bannerCard, setBannerCard] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Efecto para establecer la tarjeta de banner inicial y manejar el estado de carga
    useEffect(() => {
        if (videos.length > 0) {
            setBannerCard(videos[0]);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [videos]);

    // Creación de un objeto de búsqueda para categorías
    const categoryLookup = useMemo(() => {
        const lookup = {};
        categoryData.forEach(category => {
            lookup[category.name] = category;
        });
        return lookup;
    }, []);

    // Manejar el clic en una tarjeta de video para establecerla como banner
    const handleCardClick = useCallback((card) => {
        setBannerCard(card);
        const bannerElement = document.getElementById('banner');
        if (bannerElement) {
            bannerElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Manejar la eliminación de una tarjeta de video y actualizar el banner si es necesario
    const handleCardDelete = useCallback((cardId) => {
        deleteVideo(cardId);
        if (bannerCard && bannerCard.id === cardId && videos.length > 0) {
            setBannerCard(videos[0]);
        } else if (videos.length === 0) {
            setBannerCard(null);
        }
    }, [bannerCard, deleteVideo, videos]);

    // Manejar la edición de una tarjeta de video abriendo el modal
    const handleCardEdit = useCallback((card) => {
        setCurrentCard(card);
        setModalOpen(true);
    }, []);

    // Cerrar el modal de edición de video
    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    }, []);

    // Guardar los cambios en los detalles del video y cerrar el modal
    const handleModalSave = useCallback((updatedCard) => {
        updateVideo(updatedCard);
        setModalOpen(false);
    }, [updateVideo]);

    return (
        isLoading ?
            <Loading /> :
            <div className="home-container">
                {bannerCard && <Banner card={bannerCard} categoryLookup={categoryLookup} />}
                {categoryData.map(category => (
                    <Category
                        key={category.id}
                        datos={category}
                        cards={videos.filter(card => card.category === category.name)}
                        onCardClick={handleCardClick}
                        onCardDelete={handleCardDelete}
                        onCardEdit={handleCardEdit}
                    />
                ))}
                <Modal
                    card={currentCard}
                    isOpen={modalOpen}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            </div>
    );
}

export default Home;
