import type { Size } from "@/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize?: Size;
  availableSize: Size[];

  onSizeChanged:(size:Size)=> void
}

export const SizeSelector = ({ selectedSize, availableSize, onSizeChanged }: Props) => {
  return (
    <>
      <div className="my-5">
        <h3 className="mb-4 font-bold">Tallas disponibles</h3>

        <div className="flex">
            {
                availableSize.map((el)=>(
                    <button onClick={()=>onSizeChanged(el)} key={el} className={clsx("mx-2 hover:underline txt-lg",{
                        'underline':el === selectedSize
                    } )}>{el}</button>
                ))
            }
        </div>
      </div>
    </>
  );
};
