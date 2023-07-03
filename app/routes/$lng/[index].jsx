
import {  Modal} from "antd";
import { useEffect, useState } from "react";
import {  useParams,Link } from "react-router-dom";

import eventModalStyles from "../../styles/EventModal.css";

import styled from "@emotion/styled";

import { json } from "@remix-run/node";


import { i18n } from "~/i18n.server";
import ModalTitle from "~/components/ModalTitle/MpdalTitle";

const StyledEventTitle = styled.div`
  display: flex;
  flex-direction: column;

  & svg {
    margin-bottom: 0.4rem;
    width: 1.5rem;
    height: 1.5rem;
    fill: #005af0;
  }
`;


const StyledSummory = styled.div`
  h2 {
    font-size: 30px;
    margin: -130;
  }
  @media screen and (min-width: 13.125em) {
    h2 {
      font-size: 25px;
    }
  }
`;


const StyleDescription = styled.div`
  p {
    font-size: 34px;
    margin: 0;
  }
  @media screen and (min-width: 33.125em) {
    p {
      font-size: 25px;
    }
  }
`;


const StyledEventContent = styled.div`
  display: flex;
  flex-direction: column;
  img {
    max-width: 100%;
    object-fit: contain;
  }

  & > * {
    margin-bottom: 1rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    display: block;
    padding-left: 2rem;
  }
`;

<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>


 

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: eventModalStyles,
    },
  ];
};

 


function EventModalTitleBlock({ title }) {
 
  return (
    <ModalTitle title={title}>
      
    </ModalTitle>
  );
}

export default function EventModal() {
 
  const params = useParams(); //ru/en/es
  const modalDeafaultText = {"ru":{"title":"Афиша - куда сходить.", "description":`<br><h2>На нашем сайте афиша - содержится расписания концертов,
   выставок, спектаклей, кино и театров для взрослых и детей. Поиск новых мест на карте ответит на вопрос, что посмотреть сегодня или в ближайшие,
   поможет исследовать город, познакомится с местными обычаями и культурой.<li><a href="https://inradius.space/ru/p/top-places-to-visit-in-moskow">Куда сходить в Москве</a></li><li><a href="https://inradius.space/ru/p/kuda-shodit-v-sankt-peterburge">Куда сходить в Санкт-Петербурге</a></li><li><a href="https://inradius.space/ru/p/kuda-shodit-v-sochi">Что посмотреть Сочи</a></li></h2><br><div class="trustpilot-widget" data-locale="ru-RU" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="634e6e0fe31c48ce9a61515c" data-style-height="52px" data-style-width="100%">
  <a href="https://www.trustpilot.com/review/inradius.space" target="_blank" rel="noopener">Trustpilot</a>
</div>`},
                           "en":{"title":"Events nearby","description":`<br><h2>Our website contains schedules📅 of concerts, exhibitions, performances, cinemas and theaters for adults and children🚸.
                            Searching for new places on the map will answer the question of where to go today,  help you explore a new city🏰, get acquainted with local customs and culture.</h2><br>
                            <div class="trustpilot-widget" data-locale="en-US" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="634e6e0fe31c48ce9a61515c" data-style-height="52px" data-style-width="100%">
  <a href="https://www.trustpilot.com/review/inradius.space" target="_blank" rel="noopener">Trustpilot</a><
</div>`},
                           "es":{"title":"Eventos locales cercanos",  "description":`<br><h2>Nuestro sitio web contiene horarios 📅 de conciertos, exposiciones, espectáculos, cines y teatros para 
                           adultos y niños 🚸. Buscar nuevos lugares en el mapa responderá a la pregunta de dónde ir hoy y lo ayudará a explorar una nueva ciudad🏰, familiarizarse con las 
                           costumbres y la cultura locales.</h2><br><div class="trustpilot-widget" data-locale="es-ES" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="634e6e0fe31c48ce9a61515c" data-style-height="52px" data-style-width="100%">
                           <a href="https://www.trustpilot.com/review/inradius.space" target="_blank" rel="noopener">Trustpilot</a>
                         </div>`}}

                         const titleM = modalDeafaultText[params.lng].title
                         const descriptinM = modalDeafaultText[params.lng].description
                         
                        
                         const [isModalVisible, setIsModalVisible] = useState(false);
                       
                         useEffect(() => {
                           const script = document.createElement("script")
                           script.src =
                             "//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                           document.body.appendChild(script)
                           return () => {
                            document.body.removeChild(script)
                           }
                         }, [])
                       
                         useEffect(() => {
                           setIsModalVisible(true);
                         }, [ ]);
                       
                         const handleOk = () => {
                           setIsModalVisible(false);
                         };
                       
                         const handleCancel = () => {
                           setIsModalVisible(false);
                         };
                       
                        
                        
                         return (
                           <>
                             <Modal
                               title={
                                 <EventModalTitleBlock
                                   title={titleM}
                                 
                                 />
                               }
                                
                               descriptipn={descriptinM}
                               open={isModalVisible}
                               onOk={handleOk}
                               onCancel={handleCancel}
                            
                               className="event__modal"
                               footer={
                                 <></>
                                }
                                
                               >
                               
                                  <StyledEventContent>
                                 <StyledSummory>
                                   <h2 dangerouslySetInnerHTML={{ __html: descriptinM }}></h2>
                                 </StyledSummory>
                             </StyledEventContent>
                               
                             </Modal>
                        
                           </>
                         );
                         
                       }
