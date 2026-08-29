import type { IntakeFormData } from '../../types';
import { ProductTable } from '../questions/ProductTable';
import { ProcedureTable } from '../questions/ProcedureTable';
import { YesNoToggle } from '../questions/YesNoToggle';
import { VoiceButton } from '../ui/VoiceButton';
import { AnimatePresence, motion } from 'framer-motion';

interface TreatmentsScreenProps {
  data: IntakeFormData;
  lang: 'en' | 'hi';
  onTriedProducts: (v: boolean) => void;
  onTriedProcedures: (v: boolean) => void;
  onNested: (path: string[], value: unknown) => void;
  onField: (field: string, value: unknown) => void;
}

export function TreatmentsScreen({
  data,
  lang,
  onTriedProducts,
  onTriedProcedures,
  onNested,
  onField,
}: TreatmentsScreenProps) {
  const hi = lang === 'hi';

  return (
    <div className="screen-stack">
      <div className="question">
        <p className="question__label">
          {hi ? 'Koi shampoo, oil, minoxidil ya supplement try kiya?' : 'Have you tried any hair products or medicines?'}
        </p>
        <p className="question__subtitle">{hi ? 'Shampoo, oil, minoxidil, supplements' : 'Medicated shampoo, oils, minoxidil, supplements'}</p>
        <YesNoToggle
          value={data.tried_products}
          onChange={onTriedProducts}
          yesLabel={hi ? 'Haan' : 'Yes'}
          noLabel={hi ? 'Abhi nahi' : 'Not yet'}
        />
      </div>

      {data.tried_products === true && (
        <div className="question">
          <p className="question__label">{hi ? 'Kaunse use kiye?' : 'Which ones?'}</p>
          <p className="question__subtitle">{hi ? 'Minoxidil liquid/foam hota hai — Tugain, Morr, Rogaine' : 'Minoxidil is the liquid or foam — Tugain, Morr, Rogaine'}</p>
          <ProductTable products={data.products} onChange={onNested} />
        </div>
      )}

      <div className="question">
        <p className="question__label">{hi ? 'Clinic me koi procedure?' : 'Any in-clinic procedures?'}</p>
        <p className="question__subtitle">PRP, GFC, transplant</p>
        <YesNoToggle
          value={data.tried_procedures}
          onChange={onTriedProcedures}
          yesLabel={hi ? 'Haan' : 'Yes'}
          noLabel={hi ? 'Nahi' : 'No'}
        />
      </div>

      {data.tried_procedures === true && (
        <div className="question">
          <ProcedureTable procedures={data.procedures} onChange={onNested} />
        </div>
      )}

      <div className="question">
        <p className="question__label">{hi ? 'Kisi treatment se side effect?' : 'Any side effects from past treatment?'}</p>
        <YesNoToggle
          value={data.past_treatment_side_effects}
          onChange={(v) => onField('past_treatment_side_effects', v)}
        />
        <AnimatePresence>
          {data.past_treatment_side_effects === true && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ marginTop: 12 }}
            >
              <textarea
                className="text-input"
                placeholder={hi ? 'Kya hua tha?' : 'What happened?'}
                value={data.past_treatment_side_effects_describe || ''}
                onChange={(e) => onField('past_treatment_side_effects_describe', e.target.value)}
              />
              <VoiceButton
                onResult={(text) => {
                  const current = data.past_treatment_side_effects_describe || '';
                  onField('past_treatment_side_effects_describe', current ? `${current} ${text}` : text);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
