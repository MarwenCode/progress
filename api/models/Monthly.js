import { Schema, model } from "mongoose";

/**
 * Schéma pour les objectifs mensuels
 * Chaque utilisateur peut avoir ses propres objectifs mensuels
 */
const monthlySchema = new Schema(
  {
    // Le mois de l'objectif (ex: "January 2024", "Février 2024")
    month: {
      type: String,
      required: [true, "Le mois est requis"],
      trim: true
    },
    
    // Le nom de l'objectif mensuel
    goalName: {
      type: String,
      required: [true, "Le nom de l'objectif est requis"],
      trim: true,
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"]
    },
    
    // Les détails ou description de l'objectif
    goalDetails: {
      type: String,
      trim: true,
      maxlength: [500, "Les détails ne peuvent pas dépasser 500 caractères"]
    },
    
    // Liste des tâches associées à cet objectif mensuel
    tasks: {
      type: [
        {
          text: {
            type: String,
            required: [true, "Le texte de la tâche est requis"],
            trim: true
          },
          completed: {
            type: Boolean,
            default: false
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      default: [] // Initialise les tâches comme un tableau vide
    },
    
    // Statut de complétion de l'objectif mensuel
    completed: {
      type: Boolean,
      default: false
    },
    
    // Référence à l'utilisateur propriétaire de cet objectif
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'utilisateur est requis"]
    }
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
    
    // Options pour la sérialisation JSON
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    
    // Options pour la sérialisation d'objet
    toObject: {
      virtuals: true
    }
  }
);

// Index pour améliorer les performances des requêtes
monthlySchema.index({ user: 1, month: 1 });
monthlySchema.index({ user: 1, completed: 1 });

// Méthode virtuelle pour calculer le pourcentage de complétion
monthlySchema.virtual('completionPercentage').get(function() {
  if (this.tasks.length === 0) return 0;
  const completedTasks = this.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / this.tasks.length) * 100);
});

// Méthode pour ajouter une tâche
monthlySchema.methods.addTask = function(taskText) {
  this.tasks.push({
    text: taskText,
    completed: false,
    createdAt: new Date()
  });
  return this.save();
};

// Méthode pour marquer une tâche comme complétée
monthlySchema.methods.toggleTask = function(taskId) {
  const task = this.tasks.id(taskId);
  if (task) {
    task.completed = !task.completed;
    return this.save();
  }
  throw new Error('Tâche non trouvée');
};

// Middleware pre-save pour mettre à jour le statut completed
monthlySchema.pre('save', function(next) {
  if (this.tasks.length > 0) {
    this.completed = this.tasks.every(task => task.completed);
  }
  next();
});

// Export du modèle
export default model("MonthlyGoal", monthlySchema);