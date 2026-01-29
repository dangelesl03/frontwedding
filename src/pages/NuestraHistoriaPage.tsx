import React from 'react';

interface Milestone {
  date: string;
  title: string;
  description: string;
}

const NuestraHistoriaPage: React.FC = () => {
  const milestones: Milestone[] = [
    {
      date: 'Julio 2016',
      title: 'El comienzo',
      description: 'Una noche mientras cenábamos viendo el mar en Cala decidimos comenzar nuestra relación, por allá en julio del 2016.'
    },
    {
      date: 'Septiembre 2023',
      title: 'El compromiso',
      description: 'Luego, en setiembre del 2023 mientras caminábamos por la orilla del rio Sena y a los pies de la torre Eiffel, Daniel se arrodilló, sacó un anillo y preguntó ¿Quieres viajar conmigo para toda la vida?'
    },
    {
      date: '2024',
      title: 'Nuestro hogar',
      description: 'El año siguiente decidimos asumir un siguiente reto: comprar un departamento, el cual a base de mucho amor y esfuerzo lo hemos convertido en nuestro hogar'
    }
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
      {/* Sección: Un sí para toda la vida */}
      <div className="mb-12 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-8">
          <h2 
            className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 text-center"
            style={{ fontFamily: '"Playfair Display", "Cormorant Garamond", "Georgia", serif' }}
          >
            Un sí para toda la vida
          </h2>
          <p className="text-gray-700 text-center leading-relaxed max-w-3xl mx-auto">
            Nos comprometimos el 9 de septiembre de 2023, durante nuestro Eurotrip. Era nuestra última noche en París. 
            Caminábamos junto al río Sena, contemplando las luces destellantes de la Torre Eiffel, cuando Daniel —sabiendo 
            cuánto amo las fotos—, había preparado en secreto una sesión para inmortalizar la ciudad del amor. En una de esas 
            tomas, Daniel se arrodilló, sacó un anillo y me preguntó: "¿Quieres ser mi compañera en este viaje llamado vida?" 
            Y así, comenzó nuestro para siempre.
          </p>
        </div>
      </div>

      {/* Imagen central */}
      <div className="mb-12">
        <img 
          src="/images/paris-proposal.jpg"
          alt="Compromiso en París junto al río Sena y la Torre Eiffel"
          className="w-full h-auto rounded-lg shadow-md object-cover"
          style={{ maxHeight: '600px' }}
        />
      </div>

      {/* Sección: Nuestros hitos (sin título) */}
      <div className="mb-12 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-8">
          {/* Timeline horizontal */}
          <div className="relative py-8">
            {/* Línea conectora - solo visible en desktop */}
            <div className="absolute top-16 left-1/4 right-1/4 h-1 bg-purple-300 hidden md:block"></div>

            {/* Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex flex-col items-center">
                  {/* Círculo púrpura con número */}
                  <div className="relative z-10 mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500">
                      <span className="text-purple-600 font-bold text-xl">{index + 1}</span>
                    </div>
                  </div>

                  {/* Contenido del milestone */}
                  <div className="text-center max-w-xs">
                    <div className="text-purple-600 font-semibold text-lg mb-2">
                      {milestone.date}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>
                      {milestone.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuestraHistoriaPage;
