// Script para crear el sistema de actividades de clientes
// Este script añade la funcionalidad de registro de actividades

const createActivitiesSystem = `
// Sistema de Actividades del Cliente
function ClientActivities({ clientId, db, user }) {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        type: 'call',
        subject: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [showForm, setShowForm] = useState(false);
    
    // Tipos de actividad
    const activityTypes = {
        call: { label: 'Llamada', icon: '📞', color: 'bg-blue-100 text-blue-800' },
        email: { label: 'Email', icon: '📧', color: 'bg-green-100 text-green-800' },
        meeting: { label: 'Reunión', icon: '🤝', color: 'bg-purple-100 text-purple-800' },
        note: { label: 'Nota', icon: '📝', color: 'bg-gray-100 text-gray-800' },
        task: { label: 'Tarea', icon: '✅', color: 'bg-yellow-100 text-yellow-800' }
    };
    
    // Cargar actividades del cliente
    useEffect(() => {
        if (!db || !user || !clientId) return;
        
        const activitiesPath = \`clientes/\${clientId}/actividades\`;
        const q = query(collection(db, activitiesPath), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activitiesData = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            setActivities(activitiesData);
        }, (error) => {
            console.error("Error loading activities:", error);
            setActivities([]);
        });
        
        return () => unsubscribe();
    }, [db, user, clientId]);
    
    // Agregar nueva actividad
    const handleAddActivity = async (e) => {
        e.preventDefault();
        if (!newActivity.subject.trim()) return;
        
        try {
            const activitiesPath = \`clientes/\${clientId}/actividades\`;
            const activityData = {
                ...newActivity,
                createdAt: new Date().toISOString(),
                createdBy: user.uid,
                createdByName: user.displayName || user.email
            };
            
            await addDoc(collection(db, activitiesPath), activityData);
            
            // Resetear formulario
            setNewActivity({
                type: 'call',
                subject: '',
                notes: '',
                date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
            
            // Actualizar última fecha de contacto del cliente
            await updateDoc(doc(db, 'clientes', clientId), {
                lastContact: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
        } catch (error) {
            console.error("Error adding activity:", error);
            alert('Error al agregar actividad');
        }
    };
    
    // Eliminar actividad
    const handleDeleteActivity = async (activityId) => {
        if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
        
        try {
            const activityPath = \`clientes/\${clientId}/actividades/\${activityId}\`;
            await deleteDoc(doc(db, activityPath));
        } catch (error) {
            console.error("Error deleting activity:", error);
            alert('Error al eliminar actividad');
        }
    };
    
    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <ClockIcon />
                    Historial de Actividades
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[#006666] text-white rounded-lg hover:bg-[#005555] flex items-center gap-2"
                >
                    <PlusIcon width={16} height={16} />
                    Nueva Actividad
                </button>
            </div>
            
            {/* Formulario de nueva actividad */}
            {showForm && (
                <form onSubmit={handleAddActivity} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Actividad
                            </label>
                            <select
                                value={newActivity.type}
                                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                {Object.entries(activityTypes).map(([key, type]) => (
                                    <option key={key} value={key}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={newActivity.date}
                                onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asunto *
                        </label>
                        <input
                            type="text"
                            value={newActivity.subject}
                            onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                            placeholder="Breve descripción de la actividad..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notas (opcional)
                        </label>
                        <textarea
                            value={newActivity.notes}
                            onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                            placeholder="Detalles adicionales..."
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#006666] text-white rounded-md hover:bg-[#005555]"
                        >
                            Guardar Actividad
                        </button>
                    </div>
                </form>
            )}
            
            {/* Lista de actividades */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                    activities.map(activity => {
                        const typeInfo = activityTypes[activity.type] || activityTypes.note;
                        return (
                            <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={\`px-2 py-1 rounded-full text-xs font-medium \${typeInfo.color}\`}>
                                                {typeInfo.icon} {typeInfo.label}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(activity.date).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                                        {activity.notes && (
                                            <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-2">
                                            Por {activity.createdByName} • {new Date(activity.createdAt).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteActivity(activity.id)}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                                        title="Eliminar actividad"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <ClockIcon width={48} height={48} className="mx-auto mb-4 opacity-50" />
                        <p>No hay actividades registradas</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-2 text-[#006666] hover:underline"
                        >
                            Registrar primera actividad
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
`;

console.log('Sistema de actividades creado. Para implementarlo:');
console.log('1. Añade el componente ClientActivities al archivo index.html');
console.log('2. Incluye <ClientActivities clientId={client.id} db={db} user={user} /> en el componente ClientDetail');
console.log('3. Actualiza las reglas de Firestore para permitir la subcolección actividades'); 