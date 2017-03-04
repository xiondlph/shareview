/**
 * Caching утилита (кеширования отзывов)
 *
 * @module      Util.Caching
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */

const

    /**
     * Загрузка и сохранения в БД отзывов
     * Яндекс.Маркета по id модели
     *
     * TODO Нужно отрефакторить
     *
     * @method grabbingYMReview
     * @param {Object} req Объект запроса сервера
     * @param {Number} ymModelId Оригинальный id модели в Яндекс Маркете
     * @param swModelId Текущий id модели во внутреней БД
     * @param reviews Cписок уже полученых отзывов для сохранения в БД
     * @param inserted Количество уже сохраненных отзывов
     */
    grabbingYMReview = (req, ymModelId, swModelId, reviews, inserted = 0) => {
        const
            total = +reviews.modelOpinions.total,
            currentPage = +reviews.modelOpinions.page,
            count = +reviews.modelOpinions.count;

        var _inserted = inserted,
            grabbedReview,
            page;

        req.model.review.insertReviews(
            reviews.modelOpinions.opinion.map(item => {
                return Object.assign(item, {
                    swModelId,
                });
            })
        ).then(() => {
            _inserted += count;

            if (total > _inserted) {
                page = currentPage + 1;

                req.api(
                    `/v1/model/${ymModelId}/opinion.json?count=10&page=${page}`,
                    (err, status, data) => {
                        if (err || status !== 200) {
                            // TODO Логирование ошибки
                            return;
                        }

                        grabbedReview = JSON.parse(data);

                        grabbingYMReview(req, ymModelId, swModelId, grabbedReview, _inserted);
                    });
            }
        }).catch(() => {
            // TODO Логирование ошибки (нужно прокинуть параметр err)
        });
    },

    /**
     * Кеширования отзывов
     *
     * @method caching
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    caching = (req, res, next) => {
        /**
         * Выполенение кеширования -
         * сохранение данных модели и
         * списка отзывов Яндекс.Маркета в БД
         *
         * @method cachingYMReview
         * @param {Object} model Объект модели товара Яндекс Маркета
         * @param {Object} reviews Список уже загруженных отзывов при первом запросе
         */
        req.cachingYMReview = (model, reviews) => {
            const
                { name, id: alias } = model,
                updatedAt = Date.now(),
                source = 'YM';

            req.model.review.createModel({
                name,
                alias,
                updatedAt,
                source,
            }).then(result => {
                const
                    ymModelId = model.id,
                    swModelId = result.insertedId;

                grabbingYMReview(req, ymModelId, swModelId, reviews);
            }).catch(() => {
                // TODO Логирование ошибки (нужно прокинуть параметр err)
            });
        };

        next();
    };

export default caching;
